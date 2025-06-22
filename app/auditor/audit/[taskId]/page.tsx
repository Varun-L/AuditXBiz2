"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoAuditorTasks, demoCategories } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Camera, Upload, CheckCircle } from "lucide-react"
import Link from "next/link"

type Question = {
  id: string
  question: string
  type: "rating" | "text_input" | "checkbox" | "photo_upload"
  min?: number
  max?: number
  required: boolean
}

type AuditTask = {
  id: string
  status: string
  payout_amount: number
  businesses: {
    id?: string
    name: string
    address: string
    city: string
    pin_code: string
  }
  business_categories: {
    name: string
    checklist: {
      questions: Question[]
    }
  }
}

export default function AuditPage({ params }: { params: { taskId: string } }) {
  const { profile, isDemoMode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [task, setTask] = useState<AuditTask | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [photos, setPhotos] = useState<string[]>([])

  useEffect(() => {
    if (profile?.role === "auditor") {
      fetchTask()
    } else if (!loading && profile?.role !== "auditor") {
      router.push("/auth/login")
    }
  }, [profile, params.taskId, isDemoMode, loading])

  const fetchTask = async () => {
    try {
      if (isDemoMode) {
        // Demo mode - get task from demo data
        const demoTask = demoAuditorTasks.find((task) => task.id === params.taskId && task.auditor_id === profile?.id)

        if (!demoTask) {
          throw new Error("Task not found")
        }

        // Get the category checklist
        const category = demoCategories.find((cat) => cat.id === demoTask.category_id)
        if (!category) {
          throw new Error("Category not found")
        }

        // Format the task data to match expected structure
        const formattedTask: AuditTask = {
          id: demoTask.id,
          status: demoTask.status,
          payout_amount: demoTask.payout_amount,
          businesses: {
            id: demoTask.business_id,
            name: demoTask.businesses.name,
            address: demoTask.businesses.address,
            city: demoTask.businesses.city,
            pin_code: demoTask.businesses.pin_code,
          },
          business_categories: {
            name: category.name,
            checklist: category.checklist,
          },
        }

        setTask(formattedTask)

        // Initialize responses
        const initialResponses: Record<string, any> = {}
        category.checklist.questions.forEach((q: Question) => {
          if (q.type === "rating") {
            initialResponses[q.id] = [q.min || 1]
          } else if (q.type === "checkbox") {
            initialResponses[q.id] = false
          } else {
            initialResponses[q.id] = ""
          }
        })
        setResponses(initialResponses)
      } else {
        // Real Supabase mode
        const { data, error } = await supabase
          .from("auditor_tasks")
          .select(`
            *,
            businesses (
              name,
              address,
              city,
              pin_code
            ),
            business_categories (
              name,
              checklist
            )
          `)
          .eq("id", params.taskId)
          .eq("auditor_id", profile?.id)
          .single()

        if (error) throw error
        setTask(data)

        // Initialize responses
        const initialResponses: Record<string, any> = {}
        data.business_categories.checklist.questions.forEach((q: Question) => {
          if (q.type === "rating") {
            initialResponses[q.id] = [q.min || 1]
          } else if (q.type === "checkbox") {
            initialResponses[q.id] = false
          } else {
            initialResponses[q.id] = ""
          }
        })
        setResponses(initialResponses)
      }
    } catch (error) {
      console.error("Error fetching task:", error)
      toast({
        title: "Error",
        description: "Failed to fetch audit task",
        variant: "destructive",
      })
      router.push("/auditor")
    } finally {
      setLoading(false)
    }
  }

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handlePhotoUpload = (questionId: string, photoUrl: string) => {
    setPhotos((prev) => [...prev, photoUrl])
    handleResponseChange(questionId, photoUrl)
  }

  const validateResponses = () => {
    if (!task) return false

    const questions = task.business_categories.checklist.questions
    for (const question of questions) {
      if (question.required) {
        const response = responses[question.id]
        if (question.type === "checkbox" && response !== true) {
          return { valid: false, message: `Please check: ${question.question}` }
        }
        if (question.type === "text_input" && (!response || response.trim() === "")) {
          return { valid: false, message: `Please answer: ${question.question}` }
        }
        if (question.type === "photo_upload" && (!response || response === "")) {
          return { valid: false, message: `Please upload photo for: ${question.question}` }
        }
        if (question.type === "rating" && (!response || response.length === 0)) {
          return { valid: false, message: `Please rate: ${question.question}` }
        }
      }
    }
    return { valid: true }
  }

  const handleSubmit = async () => {
    if (!task) return

    const validation = validateResponses()
    if (!validation.valid) {
      toast({
        title: "Incomplete Form",
        description: validation.message,
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      if (isDemoMode) {
        // Demo mode - simulate submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        toast({
          title: "Success!",
          description: "Audit report submitted successfully! (Demo Mode)",
        })
        router.push("/auditor")
        return
      }

      // Real Supabase submission
      const { error } = await supabase.from("audit_reports").insert({
        auditor_task_id: task.id,
        auditor_id: profile?.id,
        business_id: task.businesses.id,
        responses,
        photos,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Audit report submitted successfully!",
      })

      router.push("/auditor")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600">Loading audit task...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Task not found</p>
              <Link href="/auditor">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/auditor">
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Audit: {task.businesses.name}</h1>
              <p className="text-sm text-gray-600">
                Category: {task.business_categories.name} • Payout: ₹{(task.payout_amount / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg font-semibold">{task.businesses.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-lg font-semibold">{task.business_categories.name}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-lg">
                  {task.businesses.address}, {task.businesses.city}, {task.businesses.pin_code}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              Audit Checklist
            </CardTitle>
            <CardDescription>Please complete all required questions and upload necessary photos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {task.business_categories.checklist.questions.map((question, index) => (
              <div
                key={question.id}
                className="p-6 border rounded-lg space-y-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <Label className="text-base font-medium leading-relaxed">
                    {index + 1}. {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                </div>

                {question.type === "rating" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{question.min || 1}</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {responses[question.id]?.[0] || question.min || 1}
                      </span>
                      <span className="text-sm text-gray-500">{question.max || 10}</span>
                    </div>
                    <Slider
                      value={responses[question.id] || [question.min || 1]}
                      onValueChange={(value) => handleResponseChange(question.id, value)}
                      min={question.min || 1}
                      max={question.max || 10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                {question.type === "text_input" && (
                  <Textarea
                    placeholder="Enter your detailed response..."
                    value={responses[question.id] || ""}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="w-full min-h-[100px] resize-none"
                  />
                )}

                {question.type === "checkbox" && (
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={question.id}
                      checked={responses[question.id] || false}
                      onCheckedChange={(checked) => handleResponseChange(question.id, checked)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor={question.id} className="text-base">
                      Yes
                    </Label>
                  </div>
                )}

                {question.type === "photo_upload" && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Take a photo or upload an image</p>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          id={`photo-${question.id}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // Create a preview URL for the uploaded file
                              const previewUrl = URL.createObjectURL(file)
                              handlePhotoUpload(question.id, previewUrl)
                              toast({
                                title: "Photo Added",
                                description: "Photo has been added to the audit report",
                              })
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            document.getElementById(`photo-${question.id}`)?.click()
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Add Photo
                        </Button>
                      </div>
                    </div>
                    {responses[question.id] && (
                      <div className="mt-4">
                        <img
                          src={responses[question.id] || "/placeholder.svg"}
                          alt={`Photo for ${question.question}`}
                          className="h-40 w-60 object-cover rounded-lg border shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-4 pt-8 border-t">
              <Link href="/auditor">
                <Button variant="outline" size="lg">
                  Save Draft
                </Button>
              </Link>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Audit Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

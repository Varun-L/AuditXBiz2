"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Upload } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"

interface AuditTask {
  id: string
  status: string
  payout_amount: number
  businesses: {
    business_name: string
    address: string
    business_categories: {
      category_name: string
      checklist: any
    }
  }
}

interface QuestionResponse {
  question: string
  type: string
  response: any
}

export default function AuditPage({
  params,
}: {
  params: { taskId: string }
}){
  const [user, setUser] = useState<User | null>(null)
  const [task, setTask] = useState<AuditTask | null>(null)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "auditor") {
        router.push("/dashboard")
        return
      }
      setUser(currentUser)
      fetchTask(params.taskId)
    }
    fetchUser()
  }, [router, params.taskId])

  const fetchTask = async (taskId: string) => {
    const { data, error } = await supabase
      .from("auditor_tasks")
      .select(`
        *,
        businesses (
          business_name,
          address,
          business_categories (
            category_name,
            checklist
          )
        )
      `)
      .eq("id", taskId)
      .single()

    if (data) {
      setTask(data)
      // Initialize responses array based on checklist
      const checklist = data.businesses.business_categories?.checklist?.checklist || []
      const initialResponses = checklist.map((item: any) => ({
        question: item.question,
        type: item.type,
        response: item.type === "rating" ? [5] : item.type === "checkbox" ? false : "",
      }))
      setResponses(initialResponses)
    }
    setLoading(false)
  }

  const updateResponse = (index: number, value: any) => {
    setResponses((prev) => prev.map((response, i) => (i === index ? { ...response, response: value } : response)))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError("")

    try {
      // Submit audit report
      const { error: reportError } = await supabase.from("audit_reports").insert({
        auditor_task_id: params.taskId,
        auditor_id: user!.id,
        business_id: task!.businesses.id,
        responses: responses,
        photos: [], // For POC, we'll skip photo uploads
      })

      if (reportError) throw reportError

      router.push("/auditor/tasks")
    } catch (err: any) {
      setError(err.message || "Failed to submit audit report")
    }

    setSubmitting(false)
  }

  const renderQuestion = (question: any, index: number) => {
    const response = responses[index]

    switch (question.type) {
      case "rating":
        return (
          <div key={index} className="space-y-3">
            <Label>{question.question}</Label>
            <div className="px-3">
              <Slider
                value={response.response}
                onValueChange={(value) => updateResponse(index, value)}
                max={question.max || 10}
                min={question.min || 1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{question.min || 1}</span>
                <span className="font-medium">Rating: {response.response[0]}</span>
                <span>{question.max || 10}</span>
              </div>
            </div>
          </div>
        )

      case "text_input":
        return (
          <div key={index} className="space-y-2">
            <Label>{question.question}</Label>
            <Textarea
              value={response.response}
              onChange={(e) => updateResponse(index, e.target.value)}
              placeholder="Enter your response..."
            />
          </div>
        )

      case "checkbox":
        return (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`question-${index}`}
              checked={response.response}
              onCheckedChange={(checked) => updateResponse(index, checked)}
            />
            <Label htmlFor={`question-${index}`}>{question.question}</Label>
          </div>
        )

      case "photo_upload":
        return (
          <div key={index} className="space-y-2">
            <Label>{question.question}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Photo upload feature coming soon</p>
              <p className="text-xs text-gray-500">For POC, this is a placeholder</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || !task) {
    return null
  }

  const checklist = task.businesses.business_categories?.checklist?.checklist || []

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/auditor/tasks")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit: {task.businesses.business_name}</h1>
            <p className="text-gray-600">{task.businesses.business_categories?.category_name}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audit Checklist</CardTitle>
            <CardDescription>Complete all questions below to submit your audit report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Business Information</h3>
              <p className="text-blue-700 text-sm mt-1">{task.businesses.address}</p>
              <p className="text-blue-700 text-sm">Payout: ₹{(task.payout_amount / 100).toFixed(2)}</p>
            </div>

            {checklist.map((question: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg bg-white">
                {renderQuestion(question, index)}
              </div>
            ))}

            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" onClick={() => router.push("/auditor/tasks")}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Audit Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

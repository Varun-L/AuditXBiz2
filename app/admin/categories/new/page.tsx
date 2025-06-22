"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type Question = {
  id: string
  question: string
  type: "rating" | "text_input" | "checkbox" | "photo_upload"
  min?: number
  max?: number
  required: boolean
}

export default function NewCategoryPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    payoutAmount: "",
  })
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "",
      type: "rating" as const,
      min: 1,
      max: 10,
      required: true,
    },
  ])

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [profile, authLoading, router])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      type: "rating",
      min: 1,
      max: 10,
      required: true,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Category name is required")
      }

      if (!formData.payoutAmount || Number(formData.payoutAmount) <= 0) {
        throw new Error("Valid payout amount is required")
      }

      const validQuestions = questions.filter((q) => q.question.trim())
      if (validQuestions.length === 0) {
        throw new Error("Please add at least one question")
      }

      // Create checklist JSON
      const checklist = {
        questions: validQuestions.map((q) => ({
          id: q.id,
          question: q.question.trim(),
          type: q.type,
          ...(q.type === "rating" && { min: q.min || 1, max: q.max || 10 }),
          required: q.required,
        })),
      }

      console.log("Creating category with data:", {
        name: formData.name.trim(),
        payout_amount: Math.round(Number(formData.payoutAmount) * 100),
        checklist,
      })

      // Insert category
      const { data, error } = await supabase
        .from("business_categories")
        .insert({
          name: formData.name.trim(),
          payout_amount: Math.round(Number(formData.payoutAmount) * 100), // Convert to paise
          checklist,
        })
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(`Failed to create category: ${error.message}`)
      }

      console.log("Category created successfully:", data)

      toast({
        title: "Success!",
        description: `Business category "${formData.name}" created successfully`,
      })

      // Reset form
      setFormData({ name: "", payoutAmount: "" })
      setQuestions([
        {
          id: "1",
          question: "",
          type: "rating",
          min: 1,
          max: 10,
          required: true,
        },
      ])

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } catch (error: any) {
      console.error("Error creating category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-red-600 mb-4">Access denied. Admin privileges required.</p>
            <Link href="/auth/login">
              <Button>Sign In as Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Add New Category</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>Basic information about the business category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Restaurant, Medical Clinic"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutAmount">Auditor Payout (₹) *</Label>
                  <Input
                    id="payoutAmount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g., 200"
                    value={formData.payoutAmount}
                    onChange={(e) => setFormData({ ...formData, payoutAmount: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Audit Checklist</CardTitle>
                  <CardDescription>Define the questions auditors will answer for this category</CardDescription>
                </div>
                <Button type="button" onClick={addQuestion} variant="outline" disabled={submitting}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Question {index + 1}</h3>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        disabled={submitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Question Text *</Label>
                      <Textarea
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value: Question["type"]) => updateQuestion(question.id, { type: value })}
                        disabled={submitting}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Rating (1-10)</SelectItem>
                          <SelectItem value="text_input">Text Input</SelectItem>
                          <SelectItem value="checkbox">Yes/No</SelectItem>
                          <SelectItem value="photo_upload">Photo Upload</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {question.type === "rating" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Min Value</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={question.min || 1}
                          onChange={(e) => updateQuestion(question.id, { min: Number.parseInt(e.target.value) || 1 })}
                          disabled={submitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Value</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={question.max || 10}
                          onChange={(e) => updateQuestion(question.id, { max: Number.parseInt(e.target.value) || 10 })}
                          disabled={submitting}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/admin">
              <Button type="button" variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

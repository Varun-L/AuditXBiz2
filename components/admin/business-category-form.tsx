"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

interface BusinessCategoryFormProps {
  onSuccess: () => void
}

export default function BusinessCategoryForm({ onSuccess }: BusinessCategoryFormProps) {
  const [formData, setFormData] = useState({
    category_name: "",
    payout_amount: "",
    checklist: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Parse YAML and convert to JSON
      const checklistJson = parseYamlToJson(formData.checklist)

      const { error } = await supabase.from("business_categories").insert({
        category_name: formData.category_name,
        payout_amount: Number.parseInt(formData.payout_amount) * 100, // Convert to paise
        checklist: checklistJson,
      })

      if (error) throw error

      setFormData({ category_name: "", payout_amount: "", checklist: "" })
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Failed to create business category")
    }

    setLoading(false)
  }

  // Simple YAML parser for our specific use case
  const parseYamlToJson = (yamlString: string) => {
    try {
      const lines = yamlString.trim().split("\n")
      const result: any = {
        category_name: "",
        checklist: [],
      }

      let currentQuestion: any = null
      let inChecklist = false

      for (let line of lines) {
        line = line.trim()
        if (!line || line.startsWith("#")) continue

        if (line.startsWith("category_name:")) {
          result.category_name = line.split(":")[1].trim().replace(/['"]/g, "")
        } else if (line === "checklist:") {
          inChecklist = true
        } else if (inChecklist && line.startsWith("- question:")) {
          if (currentQuestion) {
            result.checklist.push(currentQuestion)
          }
          currentQuestion = {
            question: line.split("question:")[1].trim().replace(/['"]/g, ""),
            type: "",
            min: undefined,
            max: undefined,
          }
        } else if (currentQuestion && line.startsWith("type:")) {
          currentQuestion.type = line.split(":")[1].trim().replace(/['"]/g, "")
        } else if (currentQuestion && line.startsWith("min:")) {
          currentQuestion.min = Number.parseInt(line.split(":")[1].trim())
        } else if (currentQuestion && line.startsWith("max:")) {
          currentQuestion.max = Number.parseInt(line.split(":")[1].trim())
        }
      }

      if (currentQuestion) {
        result.checklist.push(currentQuestion)
      }

      // Clean up undefined min/max values
      result.checklist = result.checklist.map((item: any) => {
        const cleanItem: any = {
          question: item.question,
          type: item.type,
        }
        if (item.min !== undefined) cleanItem.min = item.min
        if (item.max !== undefined) cleanItem.max = item.max
        return cleanItem
      })

      return result
    } catch (error) {
      throw new Error("Invalid YAML format. Please check your syntax.")
    }
  }

  const sampleChecklist = `category_name: Restaurant
checklist:
  - question: "Cleanliness rating (1-10)?"
    type: rating
    min: 1
    max: 10
  - question: "Quality of ingredients used?"
    type: text_input
  - question: "Are health and safety certificates visible?"
    type: checkbox
  - question: "Upload photo of kitchen cleanliness."
    type: photo_upload`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Business Category</CardTitle>
        <CardDescription>Define a new business category with audit checklist in YAML format</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="category_name">Category Name</Label>
            <Input
              id="category_name"
              value={formData.category_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, category_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payout_amount">Payout Amount (₹)</Label>
            <Input
              id="payout_amount"
              type="number"
              value={formData.payout_amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, payout_amount: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checklist">Audit Checklist (YAML)</Label>
            <div className="text-sm text-gray-600 mb-2">
              <p>
                <strong>Supported question types:</strong>
              </p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                <li>
                  <code>rating</code> - Scale questions (requires min and max values)
                </li>
                <li>
                  <code>text_input</code> - Open text responses
                </li>
                <li>
                  <code>checkbox</code> - Yes/No questions
                </li>
                <li>
                  <code>photo_upload</code> - Photo capture requirements
                </li>
              </ul>
            </div>
            <Textarea
              id="checklist"
              value={formData.checklist}
              onChange={(e) => setFormData((prev) => ({ ...prev, checklist: e.target.value }))}
              placeholder={sampleChecklist}
              rows={15}
              className="font-mono text-sm"
              required
            />
            <div className="text-xs text-gray-500">
              <p>
                <strong>YAML Tips:</strong>
              </p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Use 2 spaces for indentation (no tabs)</li>
                <li>Questions with quotes are recommended for special characters</li>
                <li>Only rating type questions need min/max values</li>
                <li>
                  Each question starts with <code>- question:</code>
                </li>
              </ul>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


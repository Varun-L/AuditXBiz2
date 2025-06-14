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
      // Parse and validate JSON
      const checklistJson = JSON.parse(formData.checklist)

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

  const sampleChecklist = `{
  "category_name": "Restaurant",
  "checklist": [
    {
      "question": "Cleanliness rating (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10
    },
    {
      "question": "Quality of ingredients used?",
      "type": "text_input"
    },
    {
      "question": "Are health and safety certificates visible?",
      "type": "checkbox"
    },
    {
      "question": "Upload photo of kitchen cleanliness.",
      "type": "photo_upload"
    }
  ]
}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Business Category</CardTitle>
        <CardDescription>Define a new business category with audit checklist</CardDescription>
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
            <Label htmlFor="checklist">Audit Checklist (JSON)</Label>
            <Textarea
              id="checklist"
              value={formData.checklist}
              onChange={(e) => setFormData((prev) => ({ ...prev, checklist: e.target.value }))}
              placeholder={sampleChecklist}
              rows={15}
              className="font-mono text-sm"
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

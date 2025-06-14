"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

interface BusinessFormProps {
  onSuccess: () => void
}

interface BusinessCategory {
  id: string
  category_name: string
}

export default function BusinessForm({ onSuccess }: BusinessFormProps) {
  const [categories, setCategories] = useState<BusinessCategory[]>([])
  const [formData, setFormData] = useState({
    business_name: "",
    address: "",
    city: "",
    pin_code: "",
    category_id: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("business_categories")
      .select("id, category_name")
      .order("category_name")

    if (data) setCategories(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.from("businesses").insert(formData)

      if (error) throw error

      setFormData({
        business_name: "",
        address: "",
        city: "",
        pin_code: "",
        category_id: "",
      })
      onSuccess()
    } catch (err: any) {
      setError(err.message || "Failed to create business")
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Business</CardTitle>
        <CardDescription>Register a new business for auditing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              value={formData.business_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, business_name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin_code">PIN Code</Label>
              <Input
                id="pin_code"
                value={formData.pin_code}
                onChange={(e) => setFormData((prev) => ({ ...prev, pin_code: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Business Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Business"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

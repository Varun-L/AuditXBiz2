"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getDemoCategories, createDemoBusiness } from "@/lib/demo-data"

export default function NewBusinessPage() {
  const { profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    address: "",
    city: "",
    pinCode: "",
    phoneNumber: "",
    email: "",
  })

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [profile, authLoading, router])

  useEffect(() => {
    if (profile?.role === "admin") {
      fetchCategories()
    }
  }, [profile])

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true)

      if (!isSupabaseConfigured) {
        // Use demo data when Supabase is not configured
        console.log("Using demo categories data")
        const demoCategories = getDemoCategories()
        setCategories(demoCategories)
        return
      }

      const { data, error } = await supabase.from("business_categories").select("*").order("name")

      if (error) {
        console.error("Supabase error:", error)
        // Fallback to demo data on error
        console.log("Falling back to demo categories")
        const demoCategories = getDemoCategories()
        setCategories(demoCategories)
        return
      }

      console.log("Fetched categories from Supabase:", data)
      setCategories(data || [])
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      // Fallback to demo data on any error
      console.log("Using demo categories due to error")
      const demoCategories = getDemoCategories()
      setCategories(demoCategories)

      toast({
        title: "Demo Mode",
        description: "Using demo data. Configure Supabase for full functionality.",
      })
    } finally {
      setCategoriesLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Business name is required")
      }

      if (!formData.categoryId) {
        throw new Error("Please select a category")
      }

      if (!formData.address.trim()) {
        throw new Error("Address is required")
      }

      if (!formData.city.trim()) {
        throw new Error("City is required")
      }

      if (!formData.pinCode.trim()) {
        throw new Error("PIN code is required")
      }

      // Validate PIN code format (6 digits)
      if (!/^\d{6}$/.test(formData.pinCode)) {
        throw new Error("PIN code must be 6 digits")
      }

      // Validate email if provided
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      const businessData = {
        name: formData.name.trim(),
        category_id: formData.categoryId,
        address: formData.address.trim(),
        city: formData.city.trim(),
        pin_code: formData.pinCode.trim(),
        phone_number: formData.phoneNumber.trim() || null,
        email: formData.email.trim() || null,
      }

      console.log("Creating business with data:", businessData)

      if (!isSupabaseConfigured) {
        // Demo mode - simulate business creation
        console.log("Demo mode: Simulating business creation")
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        const demoBusiness = createDemoBusiness(businessData)
        console.log("Demo business created:", demoBusiness)

        toast({
          title: "Demo Success!",
          description: `Business "${formData.name}" created in demo mode. Configure Supabase for real functionality.`,
        })
      } else {
        // Real Supabase insertion
        const { data, error } = await supabase.from("businesses").insert(businessData).select()

        if (error) {
          console.error("Supabase error:", error)
          throw new Error(`Failed to create business: ${error.message}`)
        }

        console.log("Business created successfully:", data)

        toast({
          title: "Success!",
          description: `Business "${formData.name}" created successfully. Tasks have been automatically assigned.`,
        })
      }

      // Reset form
      setFormData({
        name: "",
        categoryId: "",
        address: "",
        city: "",
        pinCode: "",
        phoneNumber: "",
        email: "",
      })

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/admin")
      }, 1500)
    } catch (error: any) {
      console.error("Error creating business:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create business",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || categoriesLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Add New Business</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {!isSupabaseConfigured && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm text-orange-800">
                  <strong>Demo Mode:</strong> Supabase not configured. Data will not persist.{" "}
                  <Link href="/.env.example" className="underline">
                    Configure environment variables
                  </Link>{" "}
                  for full functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              Add a new business to the platform. Tasks will be automatically created for suppliers and auditors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter business name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} (₹{((category.payout_amount || 0) / 100).toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No categories available.{" "}
                      <Link href="/admin/categories/new" className="text-blue-600 hover:underline">
                        Create one first
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pinCode">PIN Code *</Label>
                  <Input
                    id="pinCode"
                    placeholder="Enter 6-digit PIN code"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin">
                  <Button type="button" variant="outline" disabled={submitting}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting || categories.length === 0}>
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Business"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

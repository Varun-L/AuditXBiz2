"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Truck } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SupplierOnboardingPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    physical_address: "",
    service_areas: "",
    vehicle_type: "",
    license_number: "",
    experience_years: "",
    bank_account_number: "",
    bank_name: "",
    ifsc_code: "",
    aadhaar_number: "",
    pan_number: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.from("supplier_onboarding_requests").insert({
        ...formData,
        role: "supplier",
        status: "pending",
        submitted_at: new Date().toISOString(),
      })

      if (error) throw error

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit supplier application")
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for applying to become a delivery partner with AuditX-Biz. Your application has been submitted
              successfully.
            </p>
            <p className="text-sm text-gray-500">
              Our team will review your application and contact you within 3-5 business days.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <Truck className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Become a Delivery Partner</h1>
          <p className="text-gray-600 mt-2">Join our logistics network</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Partner Application</CardTitle>
            <CardDescription>
              Please provide your details to join our delivery network. We'll review and get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_years">Years of Experience *</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience_years: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="physical_address">Address *</Label>
                <Textarea
                  id="physical_address"
                  value={formData.physical_address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, physical_address: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_areas">Service Areas *</Label>
                <Textarea
                  id="service_areas"
                  value={formData.service_areas}
                  onChange={(e) => setFormData((prev) => ({ ...prev, service_areas: e.target.value }))}
                  placeholder="e.g., Mumbai, Pune, Thane..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                  <Input
                    id="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle_type: e.target.value }))}
                    placeholder="e.g., Bike, Car, Van"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_number">Driving License Number *</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, license_number: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Financial Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name *</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bank_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_account_number">Account Number *</Label>
                    <Input
                      id="bank_account_number"
                      value={formData.bank_account_number}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bank_account_number: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="ifsc_code">IFSC Code *</Label>
                  <Input
                    id="ifsc_code"
                    value={formData.ifsc_code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ifsc_code: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Identity Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar_number">Aadhaar Number *</Label>
                    <Input
                      id="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={(e) => setFormData((prev) => ({ ...prev, aadhaar_number: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pan_number">PAN Number *</Label>
                    <Input
                      id="pan_number"
                      value={formData.pan_number}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pan_number: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By submitting this form, you agree to our terms of service and privacy policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

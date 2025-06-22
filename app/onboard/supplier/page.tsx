"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Truck, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SupplierOnboardingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    pinCode: "",
    vehicleType: "",
    vehicleNumber: "",
    drivingLicense: "",
    experience: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call - in real implementation, this would:
      // 1. Create supplier application record
      // 2. Send for admin approval
      // 3. Send confirmation email

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitted(true)

      toast({
        title: "Application Submitted!",
        description: "Your delivery partner application is under review.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">Thank you for applying to become a delivery partner with AuditX-Biz.</p>
            <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Application Review</p>
                  <p className="text-sm text-gray-600">Our team will review your application</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Document Verification</p>
                  <p className="text-sm text-gray-600">We'll verify your vehicle and license details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-orange-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Account Activation</p>
                  <p className="text-sm text-gray-600">Once approved, you'll receive login credentials</p>
                </div>
              </div>
            </div>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-orange-600" />
              <CardTitle className="text-2xl">Become a Delivery Partner</CardTitle>
            </div>
            <CardDescription>Join our network of delivery partners and help onboard new businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                <strong>Requirements:</strong>
                <br />• Valid driving license
                <br />• Own vehicle (bike/car/van)
                <br />• Smartphone for task updates
                <br />• Ability to deliver within your city
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <Input
                    id="vehicleType"
                    placeholder="e.g., Motorcycle, Car, Van"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="Enter vehicle registration number"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drivingLicense">Driving License Number *</Label>
                <Input
                  id="drivingLicense"
                  placeholder="Enter driving license number"
                  value={formData.drivingLicense}
                  onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Delivery Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe any delivery or logistics experience (optional)"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting Application..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

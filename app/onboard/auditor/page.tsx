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
import { FileText, ArrowLeft, CheckCircle, Upload, MapPin } from "lucide-react"
import { LocationPicker } from "@/components/location-picker"
import Link from "next/link"

export default function AuditorOnboardingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    pinCode: "",
    experience: "",
    aadhaarNumber: "",
    panNumber: "",
    drivingLicense: "",
    upiHandle: "",
    bankAccount: "",
    ifscCode: "",
    latitude: null as number | null,
    longitude: null as number | null,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const { toast } = useToast()

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate location
      if (!formData.latitude || !formData.longitude) {
        throw new Error("Please select your location on the map")
      }

      // Simulate API call - in real implementation, this would:
      // 1. Create auditor application record with lat/lng
      // 2. Send for admin approval
      // 3. Send confirmation email
      // 4. Once approved, location will be used for task assignment

      console.log("Submitting auditor application with location:", {
        ...formData,
        location: { lat: formData.latitude, lng: formData.longitude },
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitted(true)

      toast({
        title: "Application Submitted!",
        description: "Your auditor application with location is under review.",
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
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for applying to become an auditor with AuditX-Biz. Your location has been recorded for optimal
              task assignment.
            </p>
            <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Application Review</p>
                  <p className="text-sm text-gray-600">Our team will review your application and documents</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Location-Based Assignment</p>
                  <p className="text-sm text-gray-600">
                    Once approved, you'll receive audit tasks for businesses near your location
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Account Activation</p>
                  <p className="text-sm text-gray-600">You'll receive login credentials and mobile app access</p>
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Become an Auditor</CardTitle>
              </div>
              <CardDescription>
                Join our network of independent auditors and earn ₹150-250 per audit. Location-based assignment ensures
                you get tasks near you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertDescription>
                  <strong>Requirements:</strong>
                  <br />• Valid government ID (Aadhaar, PAN, Driving License)
                  <br />• Mobile phone with camera for field work
                  <br />• Ability to travel within your city
                  <br />• Basic English/Hindi communication skills
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

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Describe any relevant experience (quality control, inspection, etc.)"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      placeholder="Enter Aadhaar number"
                      value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      placeholder="Enter PAN number"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drivingLicense">Driving License Number</Label>
                  <Input
                    id="drivingLicense"
                    placeholder="Enter driving license number (optional)"
                    value={formData.drivingLicense}
                    onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiHandle">UPI Handle *</Label>
                    <Input
                      id="upiHandle"
                      placeholder="yourname@paytm"
                      value={formData.upiHandle}
                      onChange={(e) => setFormData({ ...formData, upiHandle: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account Number *</Label>
                    <Input
                      id="bankAccount"
                      placeholder="Enter bank account number"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    placeholder="Enter bank IFSC code"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    required
                  />
                </div>

                {/* Location Status */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Location Selection *</span>
                      {formData.latitude && formData.longitude && (
                        <span className="text-green-600 text-sm">✓ Selected</span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLocationPicker(!showLocationPicker)}
                    >
                      {showLocationPicker ? "Hide Map" : "Select Location"}
                    </Button>
                  </div>
                  {formData.latitude && formData.longitude && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </p>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload Documents (Optional)</p>
                  <p className="text-xs text-gray-500">Aadhaar, PAN, Driving License copies</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Choose Files
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting Application..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Location Picker Section */}
          <div className="space-y-6">
            {showLocationPicker && <LocationPicker onLocationSelect={handleLocationSelect} showMap={true} />}

            {!showLocationPicker && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Location-Based Task Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Nearby Assignments</p>
                      <p className="text-sm text-gray-600">
                        Get audit tasks for businesses closest to your location, reducing travel time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Higher Earnings</p>
                      <p className="text-sm text-gray-600">
                        Less travel means more audits per day and higher overall earnings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Fair Distribution</p>
                      <p className="text-sm text-gray-600">
                        Our algorithm ensures fair task distribution based on proximity and availability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

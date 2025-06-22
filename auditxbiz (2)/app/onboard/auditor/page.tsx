"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Users, CheckCircle, Upload } from "lucide-react"

export default function AuditorOnboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
    aadhaarNumber: "",
    drivingLicense: "",
    upiId: "",
    bankAccount: "",
    experience: "",
    agreeToTerms: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter coordinates manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    // Here you would submit to Supabase
    console.log("Submitting auditor registration:", formData)

    // Simulate API call
    setTimeout(() => {
      setStep(3) // Success step
    }, 1000)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Application Submitted!</CardTitle>
            <CardDescription>
              Your auditor application has been submitted successfully. We'll review your documents and get back to you
              within 48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Document verification (24-48 hours)</li>
                <li>• Background check and approval</li>
                <li>• Training session scheduling</li>
                <li>• Account activation and first assignments</li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Become an Auditor</h1>
          <p className="text-gray-600 mt-2">
            Join our network of certified auditors and earn money by conducting business audits
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step === 1 ? "Personal Information" : "Documents & Verification"}</CardTitle>
            <CardDescription>
              {step === 1
                ? "Tell us about yourself and your contact details"
                : "Provide verification documents and payment information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91-9999999999"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Location Coordinates</Label>
                      <Button type="button" variant="outline" onClick={getCurrentLocation}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Current Location
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input
                          id="latitude"
                          placeholder="19.0760"
                          value={formData.latitude}
                          onChange={(e) => handleInputChange("latitude", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input
                          id="longitude"
                          placeholder="72.8777"
                          value={formData.longitude}
                          onChange={(e) => handleInputChange("longitude", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Describe any relevant experience in auditing, quality control, or business evaluation..."
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={
                        !formData.fullName ||
                        !formData.phone ||
                        !formData.email ||
                        !formData.address ||
                        !formData.latitude ||
                        !formData.longitude
                      }
                    >
                      Next Step
                    </Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                    <Input
                      id="aadhaarNumber"
                      placeholder="1234 5678 9012"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drivingLicense">Driving License Number</Label>
                    <Input
                      id="drivingLicense"
                      placeholder="Enter driving license number"
                      value={formData.drivingLicense}
                      onChange={(e) => handleInputChange("drivingLicense", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Document Uploads</Label>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Aadhaar Card
                        </Button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Upload clear photo of your Aadhaar card
                        </p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Driving License
                        </Button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Upload clear photo of your driving license (optional)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID *</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@paytm"
                        value={formData.upiId}
                        onChange={(e) => handleInputChange("upiId", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Bank Account Number</Label>
                      <Input
                        id="bankAccount"
                        placeholder="Enter bank account number"
                        value={formData.bankAccount}
                        onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Earning Information</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Restaurant audits: ₹500 per audit</li>
                      <li>• Retail store audits: ₹400 per audit</li>
                      <li>• Service center audits: ₹450 per audit</li>
                      <li>• Payments processed within 24 hours of audit completion</li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions, privacy policy, and auditor code of conduct
                    </Label>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.agreeToTerms || !formData.aadhaarNumber || !formData.upiId}
                    >
                      Submit Application
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Building, ArrowLeft, CheckCircle, MapPin } from "lucide-react"
import { LocationPicker } from "@/components/location-picker"
import Link from "next/link"

export default function BusinessOnboardingPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    pinCode: "",
    description: "",
    latitude: null as number | null,
    longitude: null as number | null,
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const businessCategories = [
    "Restaurant",
    "Medical Clinic",
    "Retail Store",
    "Pharmacy",
    "Grocery Store",
    "Beauty Salon",
    "Fitness Center",
    "Educational Institute",
  ]

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
      // If we got an address from reverse geocoding, we could update the address field
      // address: address || formData.address,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate location
      if (!formData.latitude || !formData.longitude) {
        throw new Error("Please select your business location on the map")
      }

      // Simulate API call - in real implementation, this would:
      // 1. Create business record with lat/lng
      // 2. PostGIS will auto-assign nearest auditor and supplier
      // 3. Generate tasks for both with calculated distances
      // 4. Send confirmation email

      console.log("Submitting business with location:", {
        ...formData,
        location: { lat: formData.latitude, lng: formData.longitude },
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitted(true)

      toast({
        title: "Success!",
        description: "Your business has been registered with location-based assignment.",
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for registering your business with AuditX-Biz. Here's what happens next:
            </p>
            <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Location-Based Assignment</p>
                  <p className="text-sm text-gray-600">
                    The nearest supplier and auditor will be automatically assigned based on your location
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Kit Delivery</p>
                  <p className="text-sm text-gray-600">
                    Your assigned delivery partner will contact you to deliver the onboarding kit
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Audit Scheduling</p>
                  <p className="text-sm text-gray-600">
                    Your assigned auditor will visit your business to conduct the transparency audit
                  </p>
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
                <Building className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Register Your Business</CardTitle>
              </div>
              <CardDescription>
                Join AuditX-Biz to get transparent audits and build customer trust. Location-based assignment ensures
                the nearest auditor and supplier are assigned to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertDescription>
                  <strong>What happens after registration:</strong>
                  <br />• Nearest delivery partner assigned automatically
                  <br />• Nearest auditor assigned based on your location
                  <br />• You'll receive email updates throughout the process
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Business Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      placeholder="Enter owner's full name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                    />
                  </div>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email for updates (optional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete business address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pinCode">PIN Code *</Label>
                    <Input
                      id="pinCode"
                      placeholder="Enter PIN code"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your business (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Location Status */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Location Selection</span>
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

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering Business..." : "Register Business"}
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
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Why Location Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Smart Assignment</p>
                      <p className="text-sm text-gray-600">
                        We automatically assign the nearest auditor and supplier to minimize travel time and costs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Faster Service</p>
                      <p className="text-sm text-gray-600">
                        Local auditors and suppliers can reach you quickly, speeding up the entire process
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Cost Effective</p>
                      <p className="text-sm text-gray-600">
                        Reduced travel distances mean lower costs and more competitive pricing
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

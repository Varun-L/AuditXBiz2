"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle, Clock, Building, UserCheck, Truck } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import Navbar from "@/components/layout/navbar"

interface OnboardingRequest {
  id: string
  full_name?: string
  business_name?: string
  email: string
  phone_number: string
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  role?: string
  [key: string]: any
}

export default function ApprovalsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [businessRequests, setBusinessRequests] = useState<OnboardingRequest[]>([])
  const [auditorRequests, setAuditorRequests] = useState<OnboardingRequest[]>([])
  const [supplierRequests, setSupplierRequests] = useState<OnboardingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "admin") {
        router.push("/dashboard")
        return
      }
      setUser(currentUser)
      fetchRequests()
    }
    fetchUser()
  }, [router])

  const fetchRequests = async () => {
    // In demo mode, we'll use mock data
    setBusinessRequests([
      {
        id: "biz-req-1",
        business_name: "Green Valley Restaurant",
        email: "owner@greenvalley.com",
        phone_number: "+91-9876543220",
        contact_person: "Raj Patel",
        city: "Mumbai",
        status: "pending",
        submitted_at: "2024-01-26T10:00:00Z",
      },
      {
        id: "biz-req-2",
        business_name: "City Pharmacy Plus",
        email: "info@citypharmacy.com",
        phone_number: "+91-9876543221",
        contact_person: "Dr. Sharma",
        city: "Delhi",
        status: "pending",
        submitted_at: "2024-01-25T14:30:00Z",
      },
    ])

    setAuditorRequests([
      {
        id: "aud-req-1",
        full_name: "Priya Singh",
        email: "priya.singh@email.com",
        phone_number: "+91-9876543222",
        experience_years: "5",
        specializations: "Restaurant and Food Safety Auditing",
        status: "pending",
        submitted_at: "2024-01-24T09:15:00Z",
        role: "auditor",
      },
    ])

    setSupplierRequests([
      {
        id: "sup-req-1",
        full_name: "Amit Kumar",
        email: "amit.delivery@email.com",
        phone_number: "+91-9876543223",
        vehicle_type: "Bike",
        service_areas: "Mumbai, Thane",
        status: "pending",
        submitted_at: "2024-01-23T16:45:00Z",
        role: "supplier",
      },
    ])

    setLoading(false)
  }

  const handleApproval = async (requestId: string, type: string, action: "approve" | "reject") => {
    // In demo mode, just update the local state
    const updateRequests = (requests: OnboardingRequest[]) =>
      requests.map((req) =>
        req.id === requestId ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req,
      )

    if (type === "business") {
      setBusinessRequests(updateRequests)
    } else if (type === "auditor") {
      setAuditorRequests(updateRequests)
    } else if (type === "supplier") {
      setSupplierRequests(updateRequests)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Onboarding Approvals</h1>
            <p className="text-gray-600">Review and approve onboarding requests</p>
          </div>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>Businesses ({businessRequests.filter((r) => r.status === "pending").length})</span>
            </TabsTrigger>
            <TabsTrigger value="auditor" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Auditors ({auditorRequests.filter((r) => r.status === "pending").length})</span>
            </TabsTrigger>
            <TabsTrigger value="supplier" className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Suppliers ({supplierRequests.filter((r) => r.status === "pending").length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-4">
            {businessRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.business_name}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>Submitted on {new Date(request.submitted_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Contact Person</p>
                      <p className="text-sm text-gray-600">{request.contact_person}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{request.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">City</p>
                      <p className="text-sm text-gray-600">{request.city}</p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(request.id, "business", "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(request.id, "business", "reject")}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="auditor" className="space-y-4">
            {auditorRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.full_name}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>Submitted on {new Date(request.submitted_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{request.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-gray-600">{request.experience_years} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Specializations</p>
                      <p className="text-sm text-gray-600">{request.specializations}</p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(request.id, "auditor", "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(request.id, "auditor", "reject")}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="supplier" className="space-y-4">
            {supplierRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.full_name}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>
                  <CardDescription>Submitted on {new Date(request.submitted_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{request.phone_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vehicle Type</p>
                      <p className="text-sm text-gray-600">{request.vehicle_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Service Areas</p>
                      <p className="text-sm text-gray-600">{request.service_areas}</p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(request.id, "supplier", "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproval(request.id, "supplier", "reject")}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

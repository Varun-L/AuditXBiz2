"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Camera, CheckCircle, Clock, Star, Navigation, Phone, Building2 } from "lucide-react"

export default function AuditorApp() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [selectedTask, setSelectedTask] = useState(null)
  const [auditResponses, setAuditResponses] = useState({})

  // Mock data - in real app, this would come from Supabase
  const auditorProfile = {
    name: "Rajesh Kumar",
    phone: "+91-9876543210",
    totalAudits: 45,
    earnings: 22500,
    rating: 4.8,
  }

  const assignedTasks = [
    {
      id: "1",
      businessName: "Cafe Mumbai",
      category: "Restaurant",
      address: "Shop 12, Andheri West, Mumbai",
      distance: "2.3 km",
      payout: 500,
      status: "assigned",
      assignedAt: "2024-01-16T10:00:00Z",
      ownerPhone: "+91-9876543201",
      checklist: [
        { id: "q1", question: "Rate overall cleanliness", type: "rating", scale: 10, required: true },
        { id: "q2", question: "Upload kitchen photo", type: "photo", required: true },
        { id: "q3", question: "Is food license displayed?", type: "yes_no", required: true },
        { id: "q4", question: "Rate food quality", type: "rating", scale: 10, required: true },
        { id: "q5", question: "Additional comments", type: "text", required: false },
      ],
    },
    {
      id: "2",
      businessName: "Tech Store",
      category: "Retail Store",
      address: "Building A, Lower Parel, Mumbai",
      distance: "5.1 km",
      payout: 400,
      status: "assigned",
      assignedAt: "2024-01-16T14:00:00Z",
      ownerPhone: "+91-9876543202",
    },
  ]

  const completedTasks = [
    {
      id: "3",
      businessName: "Service Pro",
      category: "Service Center",
      payout: 450,
      completedAt: "2024-01-15T16:30:00Z",
      status: "completed",
    },
  ]

  const handleStartAudit = (task) => {
    setSelectedTask(task)
    setActiveTab("audit")
  }

  const handleResponseChange = (questionId, value) => {
    setAuditResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmitAudit = () => {
    // Here you would submit to Supabase
    console.log("Submitting audit:", { taskId: selectedTask.id, responses: auditResponses })

    // Reset and go back to tasks
    setSelectedTask(null)
    setAuditResponses({})
    setActiveTab("tasks")

    alert("Audit submitted successfully! Payout will be processed within 24 hours.")
  }

  const openNavigation = (address) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AuditXBiz Auditor</h1>
                <p className="text-sm text-gray-500">Welcome, {auditorProfile.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-lg font-bold text-green-600">₹{auditorProfile.earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="audit">Audit Form</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Tasks</p>
                      <p className="text-2xl font-bold">{assignedTasks.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-2xl font-bold">{auditorProfile.totalAudits}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="text-2xl font-bold flex items-center">
                        {auditorProfile.rating}
                        <Star className="h-5 w-5 text-yellow-500 ml-1" />
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Tasks */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Tasks</CardTitle>
                <CardDescription>Complete these audits to earn payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{task.businessName}</h3>
                        <p className="text-gray-600">{task.category}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {task.address} • {task.distance} away
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        ₹{task.payout}
                      </Badge>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleStartAudit(task)} className="flex-1">
                        Start Audit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openNavigation(task.address)}>
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`tel:${task.ownerPhone}`)}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}

                {assignedTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending tasks at the moment</p>
                    <p className="text-sm">New tasks will appear here when assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Form Tab */}
          <TabsContent value="audit" className="space-y-6">
            {selectedTask ? (
              <Card>
                <CardHeader>
                  <CardTitle>Audit: {selectedTask.businessName}</CardTitle>
                  <CardDescription>Complete all required questions to submit the audit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedTask.checklist?.map((question) => (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-base font-medium">
                        {question.question}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>

                      {question.type === "rating" && (
                        <div className="space-y-2">
                          <RadioGroup
                            value={auditResponses[question.id] || ""}
                            onValueChange={(value) => handleResponseChange(question.id, value)}
                          >
                            <div className="flex space-x-4">
                              {Array.from({ length: question.scale }, (_, i) => i + 1).map((rating) => (
                                <div key={rating} className="flex items-center space-x-2">
                                  <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                                  <Label htmlFor={`${question.id}-${rating}`}>{rating}</Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {question.type === "yes_no" && (
                        <RadioGroup
                          value={auditResponses[question.id] || ""}
                          onValueChange={(value) => handleResponseChange(question.id, value)}
                        >
                          <div className="flex space-x-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id={`${question.id}-no`} />
                              <Label htmlFor={`${question.id}-no`}>No</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      )}

                      {question.type === "photo" && (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full">
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                          <p className="text-xs text-gray-500">Photo will be captured using your device camera</p>
                        </div>
                      )}

                      {question.type === "text" && (
                        <Textarea
                          placeholder="Enter your comments..."
                          value={auditResponses[question.id] || ""}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex space-x-4 pt-6">
                    <Button variant="outline" onClick={() => setActiveTab("tasks")}>
                      Save Draft
                    </Button>
                    <Button onClick={handleSubmitAudit} className="flex-1">
                      Submit Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Select a task from the Tasks tab to start auditing</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit History</CardTitle>
                <CardDescription>View your completed audits and earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{task.businessName}</h3>
                      <p className="text-sm text-gray-500">{task.category}</p>
                      <p className="text-xs text-gray-400">
                        Completed on {new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                      <p className="text-sm font-semibold mt-1">₹{task.payout}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auditor Profile</CardTitle>
                <CardDescription>Your profile information and statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                      <p className="text-lg">{auditorProfile.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="text-lg">{auditorProfile.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Audits</Label>
                      <p className="text-lg font-semibold">{auditorProfile.totalAudits}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Earnings</Label>
                      <p className="text-lg font-semibold text-green-600">
                        ₹{auditorProfile.earnings.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Rating</Label>
                      <p className="text-lg font-semibold flex items-center">
                        {auditorProfile.rating}
                        <Star className="h-5 w-5 text-yellow-500 ml-1" />
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Status</Label>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

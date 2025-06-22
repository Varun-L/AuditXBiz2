"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Package, CheckCircle, Clock, MapPin, Phone, Navigation } from "lucide-react"

export default function SupplierApp() {
  const [activeTab, setActiveTab] = useState("deliveries")

  // Mock data - in real app, this would come from Supabase
  const supplierProfile = {
    name: "Logistics Pro",
    phone: "+91-9876543220",
    totalDeliveries: 128,
    successRate: 98.5,
    rating: 4.9,
  }

  const deliveryTasks = [
    {
      id: "1",
      businessName: "Cafe Mumbai",
      address: "Shop 12, Andheri West, Mumbai",
      distance: "2.3 km",
      status: "to_do",
      assignedAt: "2024-01-16T10:00:00Z",
      ownerPhone: "+91-9876543201",
      trackingNumber: null,
    },
    {
      id: "2",
      businessName: "Tech Store",
      address: "Building A, Lower Parel, Mumbai",
      distance: "5.1 km",
      status: "in_progress",
      assignedAt: "2024-01-15T14:00:00Z",
      ownerPhone: "+91-9876543202",
      trackingNumber: "TRK123456789",
    },
  ]

  const completedDeliveries = [
    {
      id: "3",
      businessName: "Service Pro",
      address: "Dadar, Mumbai",
      status: "delivered",
      deliveredAt: "2024-01-15T16:30:00Z",
      trackingNumber: "TRK123456788",
    },
  ]

  const updateDeliveryStatus = (taskId, newStatus) => {
    // Here you would update in Supabase
    console.log(`Updating delivery ${taskId} to status: ${newStatus}`)
    alert(`Delivery status updated to: ${newStatus.replace("_", " ")}`)
  }

  const openNavigation = (address) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "to_do":
        return "bg-gray-100 text-gray-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "to_do":
        return "in_progress"
      case "in_progress":
        return "shipped"
      case "shipped":
        return "delivered"
      default:
        return currentStatus
    }
  }

  const getStatusLabel = (status) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">AuditXBiz Supplier</h1>
                <p className="text-sm text-gray-500">Welcome, {supplierProfile.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-lg font-bold text-green-600">{supplierProfile.successRate}%</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-2xl font-bold">
                        {deliveryTasks.filter((t) => t.status !== "delivered").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Delivered</p>
                      <p className="text-2xl font-bold">{supplierProfile.totalDeliveries}</p>
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
                      <p className="text-2xl font-bold">{supplierProfile.rating}/5</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Deliveries */}
            <Card>
              <CardHeader>
                <CardTitle>Active Deliveries</CardTitle>
                <CardDescription>Manage your assigned delivery tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliveryTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{task.businessName}</h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {task.address} • {task.distance} away
                        </p>
                        {task.trackingNumber && (
                          <p className="text-sm text-gray-600 mt-1">Tracking: {task.trackingNumber}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(task.status)}>{getStatusLabel(task.status)}</Badge>
                    </div>

                    <div className="flex space-x-2">
                      {task.status !== "delivered" && (
                        <Button size="sm" onClick={() => updateDeliveryStatus(task.id, getNextStatus(task.status))}>
                          Mark as {getStatusLabel(getNextStatus(task.status))}
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => openNavigation(task.address)}>
                        <Navigation className="h-4 w-4 mr-1" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`tel:${task.ownerPhone}`)}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>

                    {task.status === "in_progress" && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <Label className="text-sm font-medium">Add Tracking Number</Label>
                        <div className="flex space-x-2 mt-2">
                          <Input placeholder="Enter tracking number" className="flex-1" />
                          <Button size="sm">Save</Button>
                        </div>
                      </div>
                    )}

                    {task.status === "delivered" && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">✓ Delivery completed successfully</p>
                      </div>
                    )}
                  </div>
                ))}

                {deliveryTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending deliveries at the moment</p>
                    <p className="text-sm">New delivery tasks will appear here when assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>View your completed deliveries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{delivery.businessName}</h3>
                      <p className="text-sm text-gray-500">{delivery.address}</p>
                      <p className="text-xs text-gray-400">
                        Delivered on {new Date(delivery.deliveredAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">Tracking: {delivery.trackingNumber}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Profile</CardTitle>
                <CardDescription>Your profile information and statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                      <p className="text-lg">{supplierProfile.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                      <p className="text-lg">{supplierProfile.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Total Deliveries</Label>
                      <p className="text-lg font-semibold">{supplierProfile.totalDeliveries}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Success Rate</Label>
                      <p className="text-lg font-semibold text-green-600">{supplierProfile.successRate}%</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Rating</Label>
                      <p className="text-lg font-semibold">{supplierProfile.rating}/5</p>
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

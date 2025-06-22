"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, Navigation, Search, Filter, RefreshCw, Target, Truck } from "lucide-react"

export default function GeolocationManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedRadius, setSelectedRadius] = useState("10")
  const [searchLocation, setSearchLocation] = useState("")

  // Mock data for geolocation management
  const locationStats = {
    totalBusinesses: 156,
    totalAuditors: 45,
    totalSuppliers: 23,
    avgAssignmentDistance: 2.3,
    fastestAssignment: 0.8,
    slowestAssignment: 8.5,
  }

  const recentAssignments = [
    {
      id: "1",
      businessName: "Cafe Mumbai",
      businessLocation: { lat: 19.1334, lng: 72.8267 },
      auditorName: "Rajesh Kumar",
      auditorLocation: { lat: 19.134, lng: 72.827 },
      supplierName: "Quick Delivery",
      supplierLocation: { lat: 19.133, lng: 72.8265 },
      auditorDistance: 0.8,
      supplierDistance: 1.2,
      assignedAt: "2024-01-16T10:30:00Z",
      status: "completed",
    },
    {
      id: "2",
      businessName: "Tech Store Pro",
      businessLocation: { lat: 18.975, lng: 72.8258 },
      auditorName: "Priya Sharma",
      auditorLocation: { lat: 18.9755, lng: 72.826 },
      supplierName: "Logistics Pro",
      supplierLocation: { lat: 18.9745, lng: 72.8255 },
      auditorDistance: 1.5,
      supplierDistance: 2.1,
      assignedAt: "2024-01-16T09:15:00Z",
      status: "in_progress",
    },
  ]

  const auditorsInArea = [
    {
      id: "1",
      name: "Rajesh Kumar",
      location: { lat: 19.134, lng: 72.827 },
      address: "Andheri West, Mumbai",
      activeAssignments: 2,
      completionRate: 94.5,
      avgDistance: 1.8,
      status: "active",
    },
    {
      id: "2",
      name: "Priya Sharma",
      location: { lat: 18.9755, lng: 72.826 },
      address: "Dadar, Mumbai",
      activeAssignments: 1,
      completionRate: 88.3,
      avgDistance: 2.4,
      status: "active",
    },
    {
      id: "3",
      name: "Amit Patel",
      location: { lat: 18.9388, lng: 72.8347 },
      address: "Lower Parel, Mumbai",
      activeAssignments: 0,
      completionRate: 76.2,
      avgDistance: 3.1,
      status: "available",
    },
  ]

  const suppliersInArea = [
    {
      id: "1",
      name: "Quick Delivery",
      location: { lat: 19.133, lng: 72.8265 },
      address: "Andheri Hub, Mumbai",
      activeDeliveries: 3,
      successRate: 98.5,
      avgDistance: 2.1,
      status: "active",
    },
    {
      id: "2",
      name: "Logistics Pro",
      location: { lat: 18.9745, lng: 72.8255 },
      address: "Dadar Warehouse, Mumbai",
      activeDeliveries: 1,
      successRate: 95.2,
      avgDistance: 2.8,
      status: "active",
    },
  ]

  const handleManualAssignment = (businessId: string, auditorId: string, supplierId: string) => {
    console.log(`Manual assignment: Business ${businessId} -> Auditor ${auditorId}, Supplier ${supplierId}`)
    alert("Manual assignment completed successfully!")
  }

  const handleReassignment = (assignmentId: string) => {
    console.log(`Reassigning assignment ${assignmentId}`)
    alert("Reassignment initiated!")
  }

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Geolocation Management</h1>
                <p className="text-sm text-gray-500">Monitor and manage location-based assignments</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                View Map
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="auditors">Auditors</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Location Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Assignment Distance</CardTitle>
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatDistance(locationStats.avgAssignmentDistance)}</div>
                  <p className="text-xs text-muted-foreground">Across all assignments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Closest Assignment</CardTitle>
                  <Target className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatDistance(locationStats.fastestAssignment)}
                  </div>
                  <p className="text-xs text-muted-foreground">Best proximity match</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Furthest Assignment</CardTitle>
                  <MapPin className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatDistance(locationStats.slowestAssignment)}
                  </div>
                  <p className="text-xs text-muted-foreground">Needs optimization</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Location-Based Assignments</CardTitle>
                <CardDescription>Latest automatic assignments with distance calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{assignment.businessName}</h3>
                          <p className="text-sm text-gray-500">
                            Assigned {new Date(assignment.assignedAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          className={
                            assignment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            <strong>Auditor:</strong> {assignment.auditorName}
                          </span>
                          <Badge variant="outline">{formatDistance(assignment.auditorDistance)}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-green-500" />
                          <span className="text-sm">
                            <strong>Supplier:</strong> {assignment.supplierName}
                          </span>
                          <Badge variant="outline">{formatDistance(assignment.supplierDistance)}</Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          View on Map
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReassignment(assignment.id)}>
                          Reassign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Assignment Management</h2>
                <p className="text-gray-600">Monitor and manage location-based task assignments</p>
              </div>
              <div className="flex space-x-2">
                <Select value={selectedRadius} onValueChange={setSelectedRadius}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Search radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Within 5km</SelectItem>
                    <SelectItem value="10">Within 10km</SelectItem>
                    <SelectItem value="20">Within 20km</SelectItem>
                    <SelectItem value="50">Within 50km</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Manual Assignment Tool */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Assignment Tool</CardTitle>
                <CardDescription>Manually assign auditors and suppliers to businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Business</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cafe-mumbai">Cafe Mumbai</SelectItem>
                        <SelectItem value="tech-store">Tech Store Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Auditor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select auditor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rajesh">Rajesh Kumar (0.8km)</SelectItem>
                        <SelectItem value="priya">Priya Sharma (1.5km)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quick">Quick Delivery (1.2km)</SelectItem>
                        <SelectItem value="logistics">Logistics Pro (2.1km)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Assign</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auditors Tab */}
          <TabsContent value="auditors" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Auditor Locations</h2>
                <p className="text-gray-600">Monitor auditor distribution and availability</p>
              </div>
              <div className="flex space-x-2">
                <Input placeholder="Search by location..." className="w-64" />
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {auditorsInArea.map((auditor) => (
                <Card key={auditor.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{auditor.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {auditor.address}
                        </p>
                      </div>
                      <Badge
                        className={
                          auditor.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {auditor.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Active Assignments</p>
                        <p className="text-lg font-semibold">{auditor.activeAssignments}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-lg font-semibold text-green-600">{auditor.completionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Distance</p>
                        <p className="text-lg font-semibold">{formatDistance(auditor.avgDistance)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Coordinates</p>
                        <p className="text-sm font-mono">
                          {auditor.location.lat.toFixed(4)}, {auditor.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        View on Map
                      </Button>
                      <Button size="sm" variant="outline">
                        Update Location
                      </Button>
                      <Button size="sm" variant="outline">
                        View Coverage Area
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Supplier Locations</h2>
                <p className="text-gray-600">Monitor supplier distribution and delivery coverage</p>
              </div>
            </div>

            <div className="grid gap-6">
              {suppliersInArea.map((supplier) => (
                <Card key={supplier.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{supplier.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {supplier.address}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{supplier.status}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Active Deliveries</p>
                        <p className="text-lg font-semibold">{supplier.activeDeliveries}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-lg font-semibold text-green-600">{supplier.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Distance</p>
                        <p className="text-lg font-semibold">{formatDistance(supplier.avgDistance)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Coordinates</p>
                        <p className="text-sm font-mono">
                          {supplier.location.lat.toFixed(4)}, {supplier.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        View on Map
                      </Button>
                      <Button size="sm" variant="outline">
                        Update Location
                      </Button>
                      <Button size="sm" variant="outline">
                        View Delivery Area
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Location Analytics</CardTitle>
                <CardDescription>Detailed insights into location-based performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Location analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

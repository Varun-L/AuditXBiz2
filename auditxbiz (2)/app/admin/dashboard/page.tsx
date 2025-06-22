"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Building2,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Shield,
  MapPin,
  Star,
  TrendingUp,
  Settings,
  Search,
  Filter,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedVipana, setSelectedVipana] = useState(null)

  // Mock data - enhanced with new features
  const stats = {
    totalVipanas: 156,
    pendingCertifications: 23,
    activeSamikshaks: 45,
    totalAriyas: 1250,
    fraudAlerts: 8,
    pendingDeliveries: 12,
    monthlyRevenue: 125000,
    certificationRate: 87.5,
  }

  const vipanas = [
    {
      id: "1",
      name: "Cafe Mumbai",
      owner: "Rajesh Patel",
      category: "Restaurant",
      status: "certified",
      score: 85.5,
      location: "Andheri West, Mumbai",
      canListProducts: true,
      productsCount: 12,
      reviewsCount: 45,
      avgRating: 4.2,
      certifiedAt: "2024-01-15",
      lastAudit: "2024-01-15",
    },
    {
      id: "2",
      name: "Tech Store Pro",
      owner: "Priya Sharma",
      category: "Retail Store",
      status: "pending",
      score: null,
      location: "Lower Parel, Mumbai",
      canListProducts: false,
      productsCount: 0,
      reviewsCount: 0,
      avgRating: 0,
      appliedAt: "2024-01-16",
    },
    {
      id: "3",
      name: "Service Center",
      owner: "Amit Kumar",
      category: "Service Center",
      status: "rejected",
      score: 45.2,
      location: "Dadar, Mumbai",
      canListProducts: false,
      productsCount: 0,
      reviewsCount: 8,
      avgRating: 2.1,
      rejectionReason: "Failed compliance requirements",
      rejectedAt: "2024-01-14",
    },
  ]

  const samikshaks = [
    {
      id: "1",
      name: "Rajesh Kumar",
      region: "Mumbai West",
      pinCodes: ["400053", "400058", "400061"],
      completionRate: 94.5,
      rejectionRate: 5.2,
      totalAudits: 67,
      avgRating: 4.7,
      status: "active",
      lastActive: "2024-01-16",
    },
    {
      id: "2",
      name: "Priya Sharma",
      region: "Mumbai Central",
      pinCodes: ["400012", "400013", "400014"],
      completionRate: 88.3,
      rejectionRate: 8.1,
      totalAudits: 52,
      avgRating: 4.4,
      status: "active",
      lastActive: "2024-01-16",
    },
    {
      id: "3",
      name: "Amit Patel",
      region: "Mumbai South",
      pinCodes: ["400001", "400002", "400005"],
      completionRate: 76.2,
      rejectionRate: 15.8,
      totalAudits: 34,
      avgRating: 3.9,
      status: "frozen",
      freezeReason: "Multiple audit rejections",
      frozenAt: "2024-01-10",
    },
  ]

  const fraudAlerts = [
    {
      id: "1",
      type: "duplicate_review",
      description: "Multiple negative reviews from same IP address for Cafe Mumbai",
      severity: "high",
      status: "investigating",
      entityType: "review",
      createdAt: "2024-01-16T10:30:00Z",
    },
    {
      id: "2",
      type: "fast_audit",
      description: "Audit completed in 8 minutes (minimum 15 minutes required)",
      severity: "medium",
      status: "pending",
      entityType: "audit",
      createdAt: "2024-01-16T09:15:00Z",
    },
    {
      id: "3",
      type: "gps_mismatch",
      description: "GPS location 500m away from business address during audit",
      severity: "high",
      status: "resolved",
      entityType: "audit",
      createdAt: "2024-01-15T14:20:00Z",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "certified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "frozen":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCertificationAction = (vipanaId, action, reason = "") => {
    console.log(`${action} certification for Vipana ${vipanaId}`, reason)
    alert(`Vipana ${action} successfully!`)
  }

  const handleScoreOverride = (vipanaId, newScore, reason) => {
    console.log(`Overriding score for Vipana ${vipanaId} to ${newScore}. Reason: ${reason}`)
    alert("Score override logged successfully!")
  }

  const handleSamikshakAction = (samikshakId, action, reason = "") => {
    console.log(`${action} Samikshak ${samikshakId}`, reason)
    alert(`Samikshak ${action} successfully!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Config
              </Button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vipanas">Vipanas</TabsTrigger>
            <TabsTrigger value="samikshaks">Samikshaks</TabsTrigger>
            <TabsTrigger value="ariyas">Ariyas</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Monitor</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vipanas</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVipanas}</div>
                  <p className="text-xs text-muted-foreground">{stats.pendingCertifications} pending certification</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Samikshaks</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSamikshaks}</div>
                  <p className="text-xs text-muted-foreground">Across all regions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.fraudAlerts}</div>
                  <p className="text-xs text-muted-foreground">Require investigation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certification Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.certificationRate}%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Review Pending Certifications
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    Investigate Fraud Alerts
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => (window.location.href = "/admin/geolocation")}
                  >
                    <MapPin className="h-6 w-6 mb-2" />
                    Geolocation Management
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vipanas Tab */}
          <TabsContent value="vipanas" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Vipana Management</h2>
                <p className="text-gray-600">Manage business certifications and product listings</p>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Search Vipanas..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {vipanas.map((vipana) => (
                <Card key={vipana.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {vipana.name}
                          <Badge className={getStatusColor(vipana.status)}>{vipana.status}</Badge>
                          {vipana.canListProducts && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Product Listing Enabled
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Owner: {vipana.owner} • {vipana.category} • {vipana.location}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Certification Score</p>
                        <p className="text-lg font-semibold">{vipana.score ? `${vipana.score}/100` : "Pending"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Products Listed</p>
                        <p className="text-lg font-semibold">{vipana.productsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reviews</p>
                        <p className="text-lg font-semibold flex items-center">
                          {vipana.reviewsCount}
                          {vipana.avgRating > 0 && (
                            <span className="ml-2 flex items-center text-sm">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              {vipana.avgRating}
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Activity</p>
                        <p className="text-sm">
                          {vipana.certifiedAt && new Date(vipana.certifiedAt).toLocaleDateString()}
                          {vipana.appliedAt && `Applied: ${new Date(vipana.appliedAt).toLocaleDateString()}`}
                          {vipana.rejectedAt && `Rejected: ${new Date(vipana.rejectedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>

                    {vipana.status === "pending" && (
                      <div className="flex space-x-2 mb-4">
                        <Button size="sm" onClick={() => handleCertificationAction(vipana.id, "approve")}>
                          Approve Certification
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const reason = prompt("Reason for rejection:")
                            if (reason) handleCertificationAction(vipana.id, "reject", reason)
                          }}
                        >
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          Request Re-audit
                        </Button>
                      </div>
                    )}

                    {vipana.status === "certified" && (
                      <div className="flex space-x-2 mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newScore = prompt("New score (0-100):")
                            const reason = prompt("Reason for override:")
                            if (newScore && reason) handleScoreOverride(vipana.id, newScore, reason)
                          }}
                        >
                          Override Score
                        </Button>
                        <Button size="sm" variant="outline">
                          Manage Products
                        </Button>
                        <Button size="sm" variant="outline">
                          View Analytics
                        </Button>
                      </div>
                    )}

                    {vipana.status === "rejected" && vipana.rejectionReason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {vipana.rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Samikshaks Tab */}
          <TabsContent value="samikshaks" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Samikshak Management</h2>
                <p className="text-gray-600">Monitor and manage auditor performance</p>
              </div>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai-west">Mumbai West</SelectItem>
                    <SelectItem value="mumbai-central">Mumbai Central</SelectItem>
                    <SelectItem value="mumbai-south">Mumbai South</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Performance
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {samikshaks.map((samikshak) => (
                <Card key={samikshak.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {samikshak.name}
                          <Badge className={getStatusColor(samikshak.status)}>{samikshak.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {samikshak.region} • Pin Codes: {samikshak.pinCodes.join(", ")}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <MapPin className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                        <p className="text-lg font-semibold text-green-600">{samikshak.completionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rejection Rate</p>
                        <p className="text-lg font-semibold text-red-600">{samikshak.rejectionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Audits</p>
                        <p className="text-lg font-semibold">{samikshak.totalAudits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Average Rating</p>
                        <p className="text-lg font-semibold flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          {samikshak.avgRating}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mb-4">
                      <Button size="sm" variant="outline">
                        Assign Audit
                      </Button>
                      <Button size="sm" variant="outline">
                        View Performance
                      </Button>
                      {samikshak.status === "active" ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = prompt("Reason for freezing account:")
                            if (reason) handleSamikshakAction(samikshak.id, "freeze", reason)
                          }}
                        >
                          Freeze Account
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleSamikshakAction(samikshak.id, "unfreeze")}>
                          Unfreeze Account
                        </Button>
                      )}
                    </div>

                    {samikshak.status === "frozen" && samikshak.freezeReason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Frozen:</strong> {samikshak.freezeReason}
                          <br />
                          <strong>Date:</strong> {new Date(samikshak.frozenAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fraud Monitor Tab */}
          <TabsContent value="fraud" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Fraud Monitoring</h2>
                <p className="text-gray-600">Detect and investigate suspicious activities</p>
              </div>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Severity</SelectItem>
                    <SelectItem value="medium">Medium Severity</SelectItem>
                    <SelectItem value="low">Low Severity</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Rules
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {fraudAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          {alert.type.replace("_", " ").toUpperCase()}
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <Badge variant="outline">{alert.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {alert.entityType} • {new Date(alert.createdAt).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{alert.description}</p>
                    <div className="flex space-x-2">
                      <Button size="sm">Investigate</Button>
                      <Button size="sm" variant="outline">
                        Mark as Resolved
                      </Button>
                      <Button size="sm" variant="outline">
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="ariyas">
            <Card>
              <CardHeader>
                <CardTitle>Ariya Management</CardTitle>
                <CardDescription>Monitor consumer engagement and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Ariya management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>Supplier & Logistics Management</CardTitle>
                <CardDescription>Manage delivery partners and kit distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Supplier management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>Generate comprehensive reports and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Manage platform settings and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Configuration interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

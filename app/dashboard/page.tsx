"use client"

import { useState, useEffect } from "react"
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
  TrendingUp,
  Settings,
  Search,
  Filter,
  Loader2,
} from "lucide-react"
import { getBusinesses, updateBusinessCertification } from "@/lib/api/businesses"
import { getAuditors, getSuppliers, updateUserStatus } from "@/lib/api/users"
import { getFraudAlerts, updateFraudAlertStatus } from "@/lib/api/fraud"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  const [businesses, setBusinesses] = useState([])
  const [auditors, setAuditors] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [fraudAlerts, setFraudAlerts] = useState([])

  // Load data from database
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [businessData, auditorData, supplierData, fraudData] = await Promise.all([
          getBusinesses(),
          getAuditors(),
          getSuppliers(),
          getFraudAlerts(),
        ])

        setBusinesses(businessData)
        setAuditors(auditorData)
        setSuppliers(supplierData)
        setFraudAlerts(fraudData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate stats from real data
  const stats = {
    totalVipanas: businesses.length,
    pendingCertifications: businesses.filter((b: any) => b.certification_status === "pending").length,
    activeSamikshaks: auditors.filter((a: any) => a.is_active && !a.is_frozen).length,
    totalAriyas: 1250, // This would come from consumers table
    fraudAlerts: fraudAlerts.filter((f: any) => f.status === "pending").length,
    pendingDeliveries: 12, // This would come from delivery_tasks
    monthlyRevenue: 125000,
    certificationRate: businesses.length
      ? (businesses.filter((b: any) => b.certification_status === "certified").length / businesses.length) * 100
      : 0,
  }

  const getStatusColor = (status: string) => {
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

  const getSeverityColor = (severity: string) => {
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

  const handleCertificationAction = async (businessId: string, action: string, reason = "") => {
    try {
      if (action === "approve") {
        await updateBusinessCertification(businessId, "certified", 85) // Default score
      } else if (action === "reject") {
        await updateBusinessCertification(businessId, "rejected", undefined, reason)
      }

      // Reload businesses data
      const updatedBusinesses = await getBusinesses()
      setBusinesses(updatedBusinesses)

      alert(`Business ${action}d successfully!`)
    } catch (error) {
      console.error(`Failed to ${action} business:`, error)
      alert(`Failed to ${action} business. Please try again.`)
    }
  }

  const handleScoreOverride = async (businessId: string, newScore: string, reason: string) => {
    try {
      await updateBusinessCertification(businessId, "certified", Number.parseFloat(newScore))

      // Reload businesses data
      const updatedBusinesses = await getBusinesses()
      setBusinesses(updatedBusinesses)

      alert("Score override completed successfully!")
    } catch (error) {
      console.error("Failed to override score:", error)
      alert("Failed to override score. Please try again.")
    }
  }

  const handleAuditorAction = async (auditorId: string, action: string, reason = "") => {
    try {
      if (action === "freeze") {
        await updateUserStatus(auditorId, true, true, reason)
      } else if (action === "unfreeze") {
        await updateUserStatus(auditorId, true, false)
      }

      // Reload auditors data
      const updatedAuditors = await getAuditors()
      setAuditors(updatedAuditors)

      alert(`Auditor ${action}d successfully!`)
    } catch (error) {
      console.error(`Failed to ${action} auditor:`, error)
      alert(`Failed to ${action} auditor. Please try again.`)
    }
  }

  const handleFraudAlertAction = async (alertId: string, action: string) => {
    try {
      await updateFraudAlertStatus(alertId, action as any)

      // Reload fraud alerts
      const updatedAlerts = await getFraudAlerts()
      setFraudAlerts(updatedAlerts)

      alert(`Fraud alert ${action} successfully!`)
    } catch (error) {
      console.error(`Failed to ${action} fraud alert:`, error)
      alert(`Failed to ${action} fraud alert. Please try again.`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
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
                  <div className="text-2xl font-bold text-green-600">{stats.certificationRate.toFixed(1)}%</div>
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
              {businesses.map((business: any) => (
                <Card key={business.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {business.name}
                          <Badge className={getStatusColor(business.certification_status)}>
                            {business.certification_status}
                          </Badge>
                          {business.can_list_products && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Product Listing Enabled
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Owner: {business.owner_name} • {business.categories?.name} • {business.address}
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
                        <p className="text-lg font-semibold">
                          {business.certification_score ? `${business.certification_score}/100` : "Pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Products Listed</p>
                        <p className="text-lg font-semibold">0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reviews</p>
                        <p className="text-lg font-semibold">0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm">{new Date(business.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {business.certification_status === "pending" && (
                      <div className="flex space-x-2 mb-4">
                        <Button size="sm" onClick={() => handleCertificationAction(business.id, "approve")}>
                          Approve Certification
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const reason = prompt("Reason for rejection:")
                            if (reason) handleCertificationAction(business.id, "reject", reason)
                          }}
                        >
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          Request Re-audit
                        </Button>
                      </div>
                    )}

                    {business.certification_status === "certified" && (
                      <div className="flex space-x-2 mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newScore = prompt("New score (0-100):")
                            const reason = prompt("Reason for override:")
                            if (newScore && reason) handleScoreOverride(business.id, newScore, reason)
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

                    {business.certification_status === "rejected" && business.rejection_reason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {business.rejection_reason}
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
              {auditors.map((auditor: any) => (
                <Card key={auditor.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {auditor.full_name}
                          <Badge className={getStatusColor(auditor.is_frozen ? "frozen" : "active")}>
                            {auditor.is_frozen ? "frozen" : "active"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{auditor.address}</CardDescription>
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
                        <p className="text-lg font-semibold text-green-600">{auditor.completion_rate || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rejection Rate</p>
                        <p className="text-lg font-semibold text-red-600">{auditor.rejection_rate || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-lg font-semibold">{auditor.is_active ? "Active" : "Inactive"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="text-sm">{new Date(auditor.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2 mb-4">
                      <Button size="sm" variant="outline">
                        Assign Audit
                      </Button>
                      <Button size="sm" variant="outline">
                        View Performance
                      </Button>
                      {!auditor.is_frozen ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = prompt("Reason for freezing account:")
                            if (reason) handleAuditorAction(auditor.id, "freeze", reason)
                          }}
                        >
                          Freeze Account
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleAuditorAction(auditor.id, "unfreeze")}>
                          Unfreeze Account
                        </Button>
                      )}
                    </div>

                    {auditor.is_frozen && auditor.freeze_reason && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Frozen:</strong> {auditor.freeze_reason}
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
              {fraudAlerts.map((alert: any) => (
                <Card key={alert.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          {alert.alert_type.replace("_", " ").toUpperCase()}
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <Badge variant="outline">{alert.status}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {alert.entity_type} • {new Date(alert.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{alert.description}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleFraudAlertAction(alert.id, "investigating")}>
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleFraudAlertAction(alert.id, "resolved")}>
                        Mark as Resolved
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleFraudAlertAction(alert.id, "dismissed")}>
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs */}
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
                <div className="grid gap-6">
                  {suppliers.map((supplier: any) => (
                    <Card key={supplier.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{supplier.full_name}</h3>
                            <p className="text-sm text-gray-500">{supplier.address}</p>
                          </div>
                          <Badge className={getStatusColor(supplier.is_active ? "active" : "inactive")}>
                            {supplier.is_active ? "active" : "inactive"}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Manage Deliveries
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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



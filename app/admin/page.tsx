"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import {
  demoCategories,
  demoBusinesses,
  demoUsers,
  demoSupplierTasks,
  demoAuditorTasks,
  demoAuditReports,
} from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/ui/fade-in"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import {
  LogOut,
  Plus,
  Users,
  Building,
  Package,
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  Truck,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { profile, loading, signOut, isDemoMode } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalCategories: 0,
    totalReports: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [profile, loading, router])

  useEffect(() => {
    if (profile?.role === "admin") {
      if (isDemoMode) {
        setStats({
          totalUsers: demoUsers.length,
          totalBusinesses: demoBusinesses.length,
          totalCategories: demoCategories.length,
          totalReports: demoAuditReports.length,
        })
        setStatsLoading(false)
      } else {
        fetchStats()
      }
    }
  }, [profile, isDemoMode])

  const fetchStats = async () => {
    try {
      const [usersResult, businessesResult, categoriesResult, reportsResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("businesses").select("id", { count: "exact" }),
        supabase.from("business_categories").select("id", { count: "exact" }),
        supabase.from("audit_reports").select("id", { count: "exact" }),
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalBusinesses: businessesResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        totalReports: reportsResult.count || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing out:", error)
      // Still redirect even if there's an error
      router.push("/dashboard")
    }
  }

  const floatingActions = [
    {
      icon: <Building className="h-4 w-4" />,
      label: "Add Business",
      onClick: () => router.push("/admin/businesses/new"),
    },
    {
      icon: <Package className="h-4 w-4" />,
      label: "Add Category",
      onClick: () => router.push("/admin/categories/new"),
    },
  ]

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile || profile.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b backdrop-blur-sm bg-white/95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <FadeIn>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AuditPro Admin
                    </h1>
                    {isDemoMode && (
                      <Badge variant="secondary" className="animate-pulse">
                        Demo Mode
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Welcome back, {profile.full_name}</p>
                </div>
              </div>
            </FadeIn>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter end={stats.totalUsers} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-200" />
                  <span className="text-xs text-blue-200">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-100">Total Businesses</CardTitle>
                <Building className="h-4 w-4 text-green-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter end={stats.totalBusinesses} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-200" />
                  <span className="text-xs text-green-200">+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Categories</CardTitle>
                <Package className="h-4 w-4 text-purple-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter end={stats.totalCategories} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3 text-purple-200" />
                  <span className="text-xs text-purple-200">Active categories</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">Audit Reports</CardTitle>
                <FileText className="h-4 w-4 text-orange-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  <AnimatedCounter end={stats.totalReports} />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <BarChart3 className="h-3 w-3 text-orange-200" />
                  <span className="text-xs text-orange-200">Completed audits</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Management Tabs */}
        <FadeIn delay={200}>
          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="businesses"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600"
              >
                Businesses
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Business Categories</CardTitle>
                      <CardDescription>Manage business categories and their audit checklists</CardDescription>
                    </div>
                    <Link href="/admin/categories/new">
                      <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <CategoriesList isDemoMode={isDemoMode} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="businesses">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl">Businesses</CardTitle>
                      <CardDescription>Manage registered businesses</CardDescription>
                    </div>
                    <Link href="/admin/businesses/new">
                      <Button className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Business
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <BusinessesList isDemoMode={isDemoMode} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Users</CardTitle>
                  <CardDescription>View all registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersList isDemoMode={isDemoMode} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Tasks Overview</CardTitle>
                  <CardDescription>Monitor supplier and auditor tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <TasksOverview isDemoMode={isDemoMode} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Audit Reports</CardTitle>
                  <CardDescription>View submitted audit reports (read-only)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportsList isDemoMode={isDemoMode} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </main>

      <FloatingActionButton actions={floatingActions} />
    </div>
  )
}

// Component for Categories List
function CategoriesList({ isDemoMode }: { isDemoMode: boolean }) {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setCategories(demoCategories)
      setLoading(false)
    } else {
      fetchCategories()
    }
  }, [isDemoMode])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("business_categories")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner className="mx-auto" />

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <FadeIn key={category.id} delay={index * 50}>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-200">
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-sm text-gray-600">Payout: ₹{(category.payout_amount / 100).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Questions: {category.checklist?.questions?.length || 0}</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </div>
        </FadeIn>
      ))}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No categories found</p>
        </div>
      )}
    </div>
  )
}

// Component for Businesses List
function BusinessesList({ isDemoMode }: { isDemoMode: boolean }) {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setBusinesses(demoBusinesses)
      setLoading(false)
    } else {
      fetchBusinesses()
    }
  }, [isDemoMode])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          *,
          business_categories (name)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error("Error fetching businesses:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner className="mx-auto" />

  return (
    <div className="space-y-4">
      {businesses.map((business, index) => (
        <FadeIn key={business.id} delay={index * 50}>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-green-200">
            <div>
              <h3 className="font-semibold text-lg">{business.name}</h3>
              <p className="text-sm text-gray-600">Category: {business.business_categories?.name}</p>
              <p className="text-sm text-gray-600">
                Location: {business.city}, {business.pin_code}
              </p>
            </div>
            <Badge variant="default" className="bg-blue-100 text-blue-700">
              Active
            </Badge>
          </div>
        </FadeIn>
      ))}
      {businesses.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No businesses found</p>
        </div>
      )}
    </div>
  )
}

// Component for Users List
function UsersList({ isDemoMode }: { isDemoMode: boolean }) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setUsers(demoUsers)
      setLoading(false)
    } else {
      fetchUsers()
    }
  }, [isDemoMode])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner className="mx-auto" />

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700"
      case "auditor":
        return "bg-green-100 text-green-700"
      case "supplier":
        return "bg-orange-100 text-orange-700"
      case "consumer":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <FadeIn key={user.id} delay={index * 50}>
          <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 hover:border-purple-200">
            <div>
              <h3 className="font-semibold text-lg">{user.full_name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">
                Location: {user.city}, {user.pin_code}
              </p>
            </div>
            <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}

// Component for Tasks Overview
function TasksOverview({ isDemoMode }: { isDemoMode: boolean }) {
  const [supplierTasks, setSupplierTasks] = useState<any[]>([])
  const [auditorTasks, setAuditorTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setSupplierTasks(demoSupplierTasks)
      setAuditorTasks(demoAuditorTasks)
      setLoading(false)
    } else {
      fetchTasks()
    }
  }, [isDemoMode])

  const fetchTasks = async () => {
    try {
      const [supplierResult, auditorResult] = await Promise.all([
        supabase
          .from("supplier_tasks")
          .select(`
            *,
            businesses (name, address),
            profiles (full_name)
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("auditor_tasks")
          .select(`
            *,
            businesses (name, address),
            profiles (full_name)
          `)
          .order("created_at", { ascending: false }),
      ])

      if (supplierResult.error) throw supplierResult.error
      if (auditorResult.error) throw auditorResult.error

      setSupplierTasks(supplierResult.data || [])
      setAuditorTasks(auditorResult.data || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner className="mx-auto" />

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
      case "package_delivered":
        return "bg-green-100 text-green-700"
      case "in_progress":
      case "package_sent":
        return "bg-blue-100 text-blue-700"
      case "todo":
      case "not_started":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5 text-orange-600" />
          Supplier Tasks
        </h3>
        <div className="space-y-3">
          {supplierTasks.map((task, index) => (
            <FadeIn key={task.id} delay={index * 50}>
              <div className="flex items-center justify-between p-3 border rounded hover:shadow-md transition-all duration-200">
                <div>
                  <p className="font-medium">{task.businesses?.name}</p>
                  <p className="text-sm text-gray-600">Supplier: {task.profiles?.full_name}</p>
                </div>
                <Badge className={getStatusBadgeColor(task.status)}>{task.status.replace("_", " ")}</Badge>
              </div>
            </FadeIn>
          ))}
          {supplierTasks.length === 0 && <p className="text-gray-500 text-center py-4">No supplier tasks found</p>}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          Auditor Tasks
        </h3>
        <div className="space-y-3">
          {auditorTasks.map((task, index) => (
            <FadeIn key={task.id} delay={index * 50}>
              <div className="flex items-center justify-between p-3 border rounded hover:shadow-md transition-all duration-200">
                <div>
                  <p className="font-medium">{task.businesses?.name}</p>
                  <p className="text-sm text-gray-600">Auditor: {task.profiles?.full_name}</p>
                  <p className="text-sm text-gray-600">Payout: ₹{(task.payout_amount / 100).toFixed(2)}</p>
                </div>
                <Badge className={getStatusBadgeColor(task.status)}>{task.status.replace("_", " ")}</Badge>
              </div>
            </FadeIn>
          ))}
          {auditorTasks.length === 0 && <p className="text-gray-500 text-center py-4">No auditor tasks found</p>}
        </div>
      </div>
    </div>
  )
}

// Component for Reports List
function ReportsList({ isDemoMode }: { isDemoMode: boolean }) {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      setReports(demoAuditReports)
      setLoading(false)
    } else {
      fetchReports()
    }
  }, [isDemoMode])

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_reports")
        .select(`
          *,
          businesses (name),
          profiles (full_name)
        `)
        .order("submitted_at", { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner className="mx-auto" />

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <FadeIn key={report.id} delay={index * 50}>
          <div className="p-4 border rounded-lg hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{report.businesses?.name}</h3>
              <Badge className="bg-green-100 text-green-700">Completed</Badge>
            </div>
            <p className="text-sm text-gray-600">Auditor: {report.profiles?.full_name}</p>
            <p className="text-sm text-gray-600">Submitted: {new Date(report.submitted_at).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Photos: {report.photos?.length || 0}</p>
            <div className="mt-3">
              <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200">
                View Report
              </Button>
            </div>
          </div>
        </FadeIn>
      ))}
      {reports.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No reports found</p>
        </div>
      )}
    </div>
  )
}

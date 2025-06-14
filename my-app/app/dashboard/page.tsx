"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building, ClipboardCheck, Truck, BarChart3 } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import Navbar from "@/components/layout/navbar"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      setUser(currentUser)
      setLoading(false)
    }
    fetchUser()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case "admin":
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Categories</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Create and manage business categories</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/admin/categories")}>
                  Manage Categories
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Businesses</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Add and manage businesses</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/admin/businesses")}>
                  Manage Businesses
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">View Reports</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>View submitted audit reports</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/admin/reports")}>
                  View Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>View and manage all users</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/admin/users")}>
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "auditor":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Audit Tasks</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>View and complete assigned audits</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/auditor/tasks")}>
                  View Tasks
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Payouts</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Track your earnings and payouts</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/auditor/payouts")}>
                  View Payouts
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "supplier":
        return (
          <div className="grid gap-6 md:grid-cols-1 max-w-md">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Delivery Tasks</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Manage your delivery assignments</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/supplier/tasks")}>
                  View Tasks
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "consumer":
        return (
          <div className="grid gap-6 md:grid-cols-1 max-w-md">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Browse Businesses</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>Explore audited businesses in your area</CardDescription>
                <Button className="mt-4" onClick={() => router.push("/consumer/businesses")}>
                  Browse Businesses
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.full_name}</h1>
          <p className="text-gray-600 capitalize">{user.role} Dashboard</p>
        </div>

        {getDashboardContent()}
      </div>
    </div>
  )
}

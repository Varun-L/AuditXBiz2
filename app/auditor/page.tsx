"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoAuditorTasks } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { LogOut, FileText, MapPin, Phone, IndianRupee, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

type AuditorTask = {
  id: string
  status: "not_started" | "on_field" | "in_progress" | "completed"
  payout_amount: number
  created_at: string
  businesses: {
    name: string
    address: string
    city: string
    pin_code: string
    phone_number?: string
  }
  business_categories: {
    name: string
  }
}

export default function AuditorDashboard() {
  const { profile, loading, signOut, isDemoMode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<AuditorTask[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "auditor")) {
      router.push("/auth/login")
    }
  }, [profile, loading, router])

  useEffect(() => {
    if (profile?.role === "auditor") {
      if (isDemoMode) {
        const auditorTasks = demoAuditorTasks.filter((task) => task.auditor_id === profile.id)
        setTasks(auditorTasks)
        const earnings = auditorTasks
          .filter((task) => task.status === "completed")
          .reduce((sum, task) => sum + task.payout_amount, 0)
        setTotalEarnings(earnings)
        setTasksLoading(false)
      } else {
        fetchTasks()
      }
    }
  }, [profile, isDemoMode])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("auditor_tasks")
        .select(`
          *,
          businesses (
            name,
            address,
            city,
            pin_code,
            phone_number
          ),
          business_categories (
            name
          )
        `)
        .eq("auditor_id", profile?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])

      // Calculate total earnings from completed tasks
      const completedTasks = data?.filter((task) => task.status === "completed") || []
      const earnings = completedTasks.reduce((sum, task) => sum + task.payout_amount, 0)
      setTotalEarnings(earnings)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      })
    } finally {
      setTasksLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/dashboard")
    }
  }

  const getStatusColor = (status: AuditorTask["status"]) => {
    switch (status) {
      case "not_started":
        return "secondary"
      case "on_field":
        return "default"
      case "in_progress":
        return "default"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: AuditorTask["status"]) => {
    switch (status) {
      case "not_started":
        return "Not Started"
      case "on_field":
        return "On Field"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  if (loading || tasksLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!profile || profile.role !== "auditor") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">Auditor Dashboard</h1>
                  {isDemoMode && <Badge variant="secondary">Demo Mode</Badge>}
                </div>
                <p className="text-sm text-gray-600">Welcome back, {profile.full_name}</p>
              </div>
            </div>
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
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status !== "completed").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "completed").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(totalEarnings / 100).toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Tasks</CardTitle>
              <CardDescription>Your assigned audit tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{task.businesses.name}</h3>
                        <Badge variant={getStatusColor(task.status)}>{getStatusLabel(task.status)}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Category:</span>
                          <span>{task.business_categories.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{task.businesses.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">City:</span>
                          <span>
                            {task.businesses.city}, {task.businesses.pin_code}
                          </span>
                        </div>
                        {task.businesses.phone_number && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{task.businesses.phone_number}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-medium">₹{(task.payout_amount / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 space-y-2">
                      {task.status !== "completed" && (
                        <Link href={`/auditor/audit/${task.id}`}>
                          <Button size="sm">{task.status === "not_started" ? "Start Audit" : "Continue"}</Button>
                        </Link>
                      )}
                      {task.status === "completed" && (
                        <Link href={`/auditor/reports/${task.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No audit tasks assigned yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payouts</CardTitle>
              <CardDescription>Your earnings from completed audits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status === "completed")
                  .map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{task.businesses.name}</p>
                        <p className="text-sm text-gray-600">{task.business_categories.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{(task.payout_amount / 100).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                      </div>
                    </div>
                  ))}
                {tasks.filter((task) => task.status === "completed").length === 0 && (
                  <div className="text-center py-8 text-gray-500">No completed audits yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

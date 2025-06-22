"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoSupplierTasks } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Package, MapPin, Phone, ArrowLeft } from "lucide-react"

type SupplierTask = {
  id: string
  status: "todo" | "in_progress" | "package_sent" | "package_delivered"
  created_at: string
  businesses: {
    name: string
    address: string
    city: string
    pin_code: string
    phone_number?: string
  }
}

export default function SupplierDashboard() {
  const { profile, loading, signOut, isDemoMode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [tasks, setTasks] = useState<SupplierTask[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "supplier")) {
      router.push("/auth/login")
    }
  }, [profile, loading, router])

  useEffect(() => {
    if (profile?.role === "supplier") {
      if (isDemoMode) {
        setTasks(demoSupplierTasks.filter((task) => task.supplier_id === profile.id))
        setTasksLoading(false)
      } else {
        fetchTasks()
      }
    }
  }, [profile, isDemoMode])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("supplier_tasks")
        .select(`
          *,
          businesses (
            name,
            address,
            city,
            pin_code,
            phone_number
          )
        `)
        .eq("supplier_id", profile?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
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

  const updateTaskStatus = async (taskId: string, newStatus: SupplierTask["status"]) => {
    try {
      if (isDemoMode) {
        // Update demo data
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
        toast({
          title: "Success",
          description: "Task status updated successfully (Demo Mode)",
        })
        return
      }

      const { error } = await supabase
        .from("supplier_tasks")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId)

      if (error) throw error

      // Update local state
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      toast({
        title: "Success",
        description: "Task status updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
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

  const getStatusColor = (status: SupplierTask["status"]) => {
    switch (status) {
      case "todo":
        return "secondary"
      case "in_progress":
        return "default"
      case "package_sent":
        return "outline"
      case "package_delivered":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: SupplierTask["status"]) => {
    switch (status) {
      case "todo":
        return "To Do"
      case "in_progress":
        return "In Progress"
      case "package_sent":
        return "Package Sent"
      case "package_delivered":
        return "Package Delivered"
      default:
        return status
    }
  }

  if (loading || tasksLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!profile || profile.role !== "supplier") {
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
                  <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
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
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Do</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "todo").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "in_progress").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "package_delivered").length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Tasks</CardTitle>
            <CardDescription>Manage your assigned delivery tasks</CardDescription>
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
                        <span className="font-medium">Assigned:</span>
                        <span>{new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Select
                      value={task.status}
                      onValueChange={(value: SupplierTask["status"]) => updateTaskStatus(task.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="package_sent">Package Sent</SelectItem>
                        <SelectItem value="package_delivered">Package Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">No delivery tasks assigned yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Package } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"

interface SupplierTask {
  id: string
  status: string
  created_at: string
  businesses: {
    business_name: string
    address: string
    city: string
    pin_code: string
  }
}

export default function SupplierTasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<SupplierTask[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "supplier") {
        router.push("/dashboard")
        return
      }
      setUser(currentUser)
      fetchTasks(currentUser.id)
    }
    fetchUser()
  }, [router])

  const fetchTasks = async (supplierId: string) => {
    const { data, error } = await supabase
      .from("supplier_tasks")
      .select(`
        *,
        businesses (
          business_name,
          address,
          city,
          pin_code
        )
      `)
      .eq("supplier_id", supplierId)
      .order("created_at", { ascending: false })

    if (data) {
      setTasks(data)
    }
    setLoading(false)
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from("supplier_tasks")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", taskId)

    if (!error) {
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "to_do":
        return "bg-gray-100 text-gray-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "package_sent":
        return "bg-yellow-100 text-yellow-800"
      case "package_delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
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
            <h1 className="text-3xl font-bold text-gray-900">My Delivery Tasks</h1>
            <p className="text-gray-600">Manage your onboarding kit deliveries</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{task.businesses.business_name}</CardTitle>
                  <Badge className={getStatusColor(task.status)}>{formatStatus(task.status)}</Badge>
                </div>
                <CardDescription>Onboarding Kit Delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{task.businesses.address}</p>
                    <p>
                      {task.businesses.city}, {task.businesses.pin_code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Assigned: {new Date(task.created_at).toLocaleDateString()}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status:</label>
                  <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to_do">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="package_sent">Package Sent</SelectItem>
                      <SelectItem value="package_delivered">Package Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}

          {tasks.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No delivery tasks assigned yet.</p>
                <p className="text-sm text-gray-400 mt-2">Tasks will appear here when new businesses are onboarded.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, DollarSign } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"

interface AuditorTask {
  id: string
  status: string
  payout_amount: number
  created_at: string
  businesses: {
    business_name: string
    address: string
    city: string
    pin_code: string
    business_categories: {
      category_name: string
    }
  }
}

export default function AuditorTasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<AuditorTask[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "auditor") {
        router.push("/dashboard")
        return
      }
      setUser(currentUser)
      fetchTasks(currentUser.id)
    }
    fetchUser()
  }, [router])

  const fetchTasks = async (auditorId: string) => {
    const { data, error } = await supabase
      .from("auditor_tasks")
      .select(`
        *,
        businesses (
          business_name,
          address,
          city,
          pin_code,
          business_categories (
            category_name
          )
        )
      `)
      .eq("auditor_id", auditorId)
      .order("created_at", { ascending: false })

    if (data) {
      setTasks(data)
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "bg-gray-100 text-gray-800"
      case "on_field":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Audit Tasks</h1>
              <p className="text-gray-600">View and manage your assigned audits</p>
            </div>
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
                <CardDescription>{task.businesses.business_categories?.category_name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <DollarSign className="h-4 w-4" />
                  <span>Payout: ₹{(task.payout_amount / 100).toFixed(2)}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Assigned: {new Date(task.created_at).toLocaleDateString()}</span>
                </div>

                {task.status === "not_started" && (
                  <Button className="w-full mt-4" onClick={() => router.push(`/auditor/audit/${task.id}`)}>
                    Start Audit
                  </Button>
                )}

                {task.status === "completed" && (
                  <Button variant="outline" className="w-full mt-4" disabled>
                    Audit Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}

          {tasks.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No audit tasks assigned yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tasks will appear here when businesses are added to the system.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

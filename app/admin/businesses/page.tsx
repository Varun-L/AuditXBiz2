"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, MapPin } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"
import BusinessForm from "@/components/admin/business-form"

interface Business {
  id: string
  business_name: string
  address: string
  city: string
  pin_code: string
  created_at: string
  business_categories: {
    category_name: string
  }
}

export default function BusinessesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "admin") {
        router.push("/dashboard")
        return
      }
      setUser(currentUser)
      fetchBusinesses()
    }
    fetchUser()
  }, [router])

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        *,
        business_categories (
          category_name
        )
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setBusinesses(data)
    }
    setLoading(false)
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
              <h1 className="text-3xl font-bold text-gray-900">Businesses</h1>
              <p className="text-gray-600">Manage registered businesses</p>
            </div>
          </div>

          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add Business"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {showForm && (
            <div className="lg:col-span-2">
              <BusinessForm
                onSuccess={() => {
                  setShowForm(false)
                  fetchBusinesses()
                }}
              />
            </div>
          )}

          <div className="lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {businesses.map((business) => (
                <Card key={business.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{business.business_name}</CardTitle>
                      <Badge variant="secondary">{business.business_categories?.category_name}</Badge>
                    </div>
                    <CardDescription>Added on {new Date(business.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>{business.address}</p>
                        <p>
                          {business.city}, {business.pin_code}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {businesses.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No businesses registered yet.</p>
                    <Button className="mt-4" onClick={() => setShowForm(true)}>
                      Add First Business
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

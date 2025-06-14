"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Search, Building } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"

interface Business {
  id: string
  business_name: string
  address: string
  city: string
  pin_code: string
  business_categories: {
    category_name: string
  }
}

export default function ConsumerBusinessesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser || currentUser.role !== "consumer") {
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
      .order("business_name")

    if (data) {
      setBusinesses(data)
      setFilteredBusinesses(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (searchTerm) {
      const filtered = businesses.filter(
        (business) =>
          business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.business_categories?.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredBusinesses(filtered)
    } else {
      setFilteredBusinesses(businesses)
    }
  }, [searchTerm, businesses])

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
            <h1 className="text-3xl font-bold text-gray-900">Browse Businesses</h1>
            <p className="text-gray-600">Discover audited businesses in your area</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search businesses, cities, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{business.business_name}</CardTitle>
                  <Badge variant="secondary">{business.business_categories?.category_name}</Badge>
                </div>
                <CardDescription>Verified Business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{business.address}</p>
                    <p>
                      {business.city}, {business.pin_code}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" className="w-full" disabled>
                    View Audit Report
                    <span className="text-xs ml-2">(Coming Soon)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBusinesses.length === 0 && businesses.length > 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No businesses found matching your search.</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}

          {businesses.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No businesses available yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Businesses will appear here once they are onboarded and audited.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoBusinesses } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Search, MapPin, Phone, Mail, Building, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Business = {
  id: string
  name: string
  address: string
  city: string
  pin_code: string
  phone_number?: string
  email?: string
  business_categories: {
    name: string
  }
}

export default function ConsumerDashboard() {
  const { profile, loading, signOut, isDemoMode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [businessesLoading, setBusinessesLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("")

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "consumer")) {
      router.push("/auth/login")
    }
  }, [profile, loading, router])

  useEffect(() => {
    if (profile?.role === "consumer") {
      if (isDemoMode) {
        setBusinesses(demoBusinesses)
        setBusinessesLoading(false)
        if (profile.city) {
          setCityFilter(profile.city)
        }
      } else {
        fetchBusinesses()
        if (profile.city) {
          setCityFilter(profile.city)
        }
      }
    }
  }, [profile, isDemoMode])

  useEffect(() => {
    filterBusinesses()
  }, [businesses, searchTerm, cityFilter])

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(`
          *,
          business_categories (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBusinesses(data || [])
    } catch (error) {
      console.error("Error fetching businesses:", error)
      toast({
        title: "Error",
        description: "Failed to fetch businesses",
        variant: "destructive",
      })
    } finally {
      setBusinessesLoading(false)
    }
  }

  const filterBusinesses = () => {
    let filtered = businesses

    // Filter by city (prioritize user's city)
    if (cityFilter) {
      filtered = filtered.filter((business) => business.city.toLowerCase().includes(cityFilter.toLowerCase()))
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.business_categories.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          business.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredBusinesses(filtered)
  }

  const getUniqueCity = () => {
    const cities = businesses.map((b) => b.city)
    return [...new Set(cities)].sort()
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

  if (loading || businessesLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!profile || profile.role !== "consumer") {
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
                  <h1 className="text-2xl font-bold text-gray-900">AuditX-Biz</h1>
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
        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Businesses</CardTitle>
            <CardDescription>Discover verified businesses in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search businesses, categories, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {getUniqueCity().map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businesses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Your City</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businesses.filter((b) => b.city === profile.city).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search Results</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredBusinesses.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Business Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Directory</CardTitle>
            <CardDescription>Browse verified businesses with transparent audit information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <Badge variant="secondary">{business.business_categories.name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        <p>{business.address}</p>
                        <p>
                          {business.city}, {business.pin_code}
                        </p>
                      </div>
                    </div>

                    {business.phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{business.phone_number}</span>
                      </div>
                    )}

                    {business.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{business.email}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link href="/consumer/reports">
                        <Button variant="outline" size="sm" className="w-full">
                          View Audit Reports
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || cityFilter
                    ? "Try adjusting your search criteria"
                    : "No businesses have been added yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

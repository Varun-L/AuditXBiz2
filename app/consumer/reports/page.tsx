"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoAuditReports, demoBusinesses } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, Search, FileText, Star, Calendar, MapPin, Eye } from "lucide-react"
import Link from "next/link"

type AuditReport = {
  id: string
  responses: Record<string, any>
  submitted_at: string
  businesses: {
    id: string
    name: string
    address: string
    city: string
    pin_code: string
  }
  profiles: {
    full_name: string
  }
}

export default function ConsumerReportsPage() {
  const { profile, isDemoMode } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<AuditReport[]>([])
  const [filteredReports, setFilteredReports] = useState<AuditReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!profile || profile.role !== "consumer") {
      router.push("/auth/login")
      return
    }
    fetchReports()
  }, [profile, isDemoMode])

  useEffect(() => {
    filterReports()
  }, [reports, searchTerm])

  const fetchReports = async () => {
    try {
      if (isDemoMode) {
        // Combine demo reports with business data
        const reportsWithBusiness = demoAuditReports.map((report) => ({
          ...report,
          businesses: {
            ...report.businesses,
            id: report.business_id,
            address: demoBusinesses.find((b) => b.id === report.business_id)?.address || "",
            city: demoBusinesses.find((b) => b.id === report.business_id)?.city || "",
            pin_code: demoBusinesses.find((b) => b.id === report.business_id)?.pin_code || "",
          },
        }))
        setReports(reportsWithBusiness as AuditReport[])
      } else {
        const { data, error } = await supabase
          .from("audit_reports")
          .select(`
            *,
            businesses (
              id,
              name,
              address,
              city,
              pin_code
            ),
            profiles (
              full_name
            )
          `)
          .order("submitted_at", { ascending: false })

        if (error) throw error
        setReports(data || [])
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.businesses.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.businesses.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredReports(filtered)
  }

  const getOverallRating = (responses: Record<string, any>) => {
    const ratings = Object.entries(responses)
      .filter(([key, value]) => Array.isArray(value) && typeof value[0] === "number")
      .map(([key, value]) => value[0])

    if (ratings.length === 0) return null
    return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/consumer">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Audit Reports</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Audit Reports</CardTitle>
            <CardDescription>Find audit reports by business name, location, or auditor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const overallRating = getOverallRating(report.responses)

            return (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.businesses.name}</CardTitle>
                    {overallRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{overallRating}/10</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p>{report.businesses.address}</p>
                      <p>
                        {report.businesses.city}, {report.businesses.pin_code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{new Date(report.submitted_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Audited by {report.profiles.full_name}</span>
                  </div>

                  <div className="pt-2">
                    <Link href={`/consumer/reports/${report.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search criteria" : "No audit reports available yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

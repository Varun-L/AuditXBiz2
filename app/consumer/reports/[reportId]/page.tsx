"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoAuditReports, demoBusinesses } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, FileText, Star, Calendar, MapPin, CheckCircle, X, Camera } from "lucide-react"
import Link from "next/link"

type AuditReport = {
  id: string
  responses: Record<string, any>
  photos: string[]
  submitted_at: string
  businesses: {
    name: string
    address: string
    city: string
    pin_code: string
  }
  profiles: {
    full_name: string
  }
}

export default function ConsumerReportViewPage({ params }: { params: { reportId: string } }) {
  const { profile, isDemoMode } = useAuth()
  const router = useRouter()
  const [report, setReport] = useState<AuditReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || profile.role !== "consumer") {
      router.push("/auth/login")
      return
    }
    fetchReport()
  }, [profile, params.reportId, isDemoMode])

  const fetchReport = async () => {
    try {
      if (isDemoMode) {
        const demoReport = demoAuditReports.find((r) => r.id === params.reportId)
        if (demoReport) {
          const business = demoBusinesses.find((b) => b.id === demoReport.business_id)
          const reportWithBusiness = {
            ...demoReport,
            businesses: {
              name: business?.name || demoReport.businesses.name,
              address: business?.address || "",
              city: business?.city || "",
              pin_code: business?.pin_code || "",
            },
          }
          setReport(reportWithBusiness as AuditReport)
        }
      } else {
        const { data, error } = await supabase
          .from("audit_reports")
          .select(`
            *,
            businesses (
              name,
              address,
              city,
              pin_code
            ),
            profiles (
              full_name
            )
          `)
          .eq("id", params.reportId)
          .single()

        if (error) throw error
        setReport(data)
      }
    } catch (error) {
      console.error("Error fetching report:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderResponse = (key: string, value: any, questionText: string) => {
    if (Array.isArray(value)) {
      // Rating response
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(10)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < value[0] ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="font-semibold text-lg">{value[0]}/10</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(value[0] / 10) * 100}%` }}></div>
          </div>
        </div>
      )
    } else if (typeof value === "boolean") {
      // Checkbox response
      return (
        <div className="flex items-center gap-2">
          {value ? <CheckCircle className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
          <span className={`font-medium ${value ? "text-green-600" : "text-red-600"}`}>{value ? "Yes" : "No"}</span>
        </div>
      )
    } else if (typeof value === "string" && value.includes("placeholder.svg")) {
      // Photo response
      return (
        <div className="space-y-2">
          <img
            src={value || "/placeholder.svg"}
            alt="Audit photo"
            className="h-48 w-full object-cover rounded-lg border shadow-sm"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Camera className="h-4 w-4" />
            <span>Photo evidence provided</span>
          </div>
        </div>
      )
    } else {
      // Text response
      return (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{value}</p>
        </div>
      )
    }
  }

  const getOverallRating = () => {
    if (!report) return null
    const ratings = Object.entries(report.responses)
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

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-gray-500 mb-4">Report not found</p>
            <Link href="/consumer/reports">
              <Button>Back to Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overallRating = getOverallRating()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/consumer/reports">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{report.businesses.name}</h1>
              <p className="text-sm text-gray-600">Transparency Audit Report</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Overall Rating */}
          {overallRating && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="text-center py-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(10)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < overallRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-3xl font-bold text-blue-600">{overallRating}/10</span>
                </div>
                <p className="text-lg font-medium text-gray-700">Overall Audit Score</p>
                <Badge
                  variant="outline"
                  className={`mt-2 ${
                    overallRating >= 8
                      ? "border-green-500 text-green-700"
                      : overallRating >= 6
                        ? "border-yellow-500 text-yellow-700"
                        : "border-red-500 text-red-700"
                  }`}
                >
                  {overallRating >= 8 ? "Excellent" : overallRating >= 6 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Business Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p className="text-lg font-semibold">{report.businesses.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Audited By</p>
                  <p className="text-lg font-semibold">{report.profiles.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-700">
                      {report.businesses.address}, {report.businesses.city}, {report.businesses.pin_code}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Audit Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-700">{new Date(report.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Audit Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Audit Results</CardTitle>
              <CardDescription>Comprehensive evaluation across all audit criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(report.responses).map(([key, value], index) => {
                  const questionText = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

                  return (
                    <div key={key} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg">{questionText}</h3>
                      </div>
                      {renderResponse(key, value, questionText)}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Photos */}
          {report.photos && report.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Audit Documentation
                </CardTitle>
                <CardDescription>Visual evidence captured during the audit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.photos.map((photo, index) => (
                    <div key={index} className="space-y-2">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Audit documentation ${index + 1}`}
                        className="h-48 w-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      />
                      <p className="text-xs text-gray-500 text-center">Evidence #{index + 1}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

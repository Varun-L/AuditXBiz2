"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { demoAuditReports } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, FileText, Star, CheckCircle, X } from "lucide-react"
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

export default function ViewReportPage({ params }: { params: { reportId: string } }) {
  const { profile, isDemoMode } = useAuth()
  const router = useRouter()
  const [report, setReport] = useState<AuditReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      fetchReport()
    }
  }, [profile, params.reportId, isDemoMode])

  const fetchReport = async () => {
    try {
      if (isDemoMode) {
        const demoReport = demoAuditReports.find((r) => r.id === params.reportId)
        if (demoReport) {
          setReport(demoReport as AuditReport)
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

  const renderResponse = (key: string, value: any) => {
    if (Array.isArray(value)) {
      // Rating response
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(10)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < value[0] ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="font-semibold text-lg">{value[0]}/10</span>
        </div>
      )
    } else if (typeof value === "boolean") {
      // Checkbox response
      return (
        <div className="flex items-center gap-2">
          {value ? <CheckCircle className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />}
          <span className={value ? "text-green-600" : "text-red-600"}>{value ? "Yes" : "No"}</span>
        </div>
      )
    } else if (typeof value === "string" && value.includes("placeholder.svg")) {
      // Photo response
      return (
        <img
          src={value || "/placeholder.svg"}
          alt="Audit photo"
          className="h-32 w-48 object-cover rounded-lg border shadow-sm"
        />
      )
    } else {
      // Text response
      return <p className="text-gray-700">{value}</p>
    }
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
            <Link href="/auditor">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/auditor">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">Audit Report</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
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
                  <p className="text-sm font-medium text-gray-500">Auditor</p>
                  <p className="text-lg font-semibold">{report.profiles.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-700">
                    {report.businesses.address}, {report.businesses.city}, {report.businesses.pin_code}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p className="text-sm text-gray-700">{new Date(report.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Responses */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Results</CardTitle>
              <CardDescription>Detailed responses to audit questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(report.responses).map(([key, value], index) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <div className="mb-3">
                      <p className="font-medium text-gray-900">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                    {renderResponse(key, value)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          {report.photos && report.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>Images captured during the audit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo || "/placeholder.svg"}
                      alt={`Audit photo ${index + 1}`}
                      className="h-48 w-full object-cover rounded-lg border shadow-sm"
                    />
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

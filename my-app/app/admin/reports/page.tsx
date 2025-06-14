"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Calendar, User, Building } from "lucide-react"
import { getCurrentUser, type User as UserType } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"

interface AuditReport {
  id: string
  responses: any
  submitted_at: string
  users: {
    full_name: string
  }
  businesses: {
    business_name: string
    business_categories: {
      category_name: string
    }
  }
}

export default function AdminReportsPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [reports, setReports] = useState<AuditReport[]>([])
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null)
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
      fetchReports()
    }
    fetchUser()
  }, [router])

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("audit_reports")
      .select(`
        *,
        users (
          full_name
        ),
        businesses (
          business_name,
          business_categories (
            category_name
          )
        )
      `)
      .order("submitted_at", { ascending: false })

    if (data) {
      setReports(data)
    }
    setLoading(false)
  }

  const renderResponse = (response: any, index: number) => {
    switch (response.type) {
      case "rating":
        return (
          <div key={index} className="space-y-2">
            <p className="font-medium text-sm">{response.question}</p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Rating: {response.response[0]}/10</Badge>
            </div>
          </div>
        )

      case "text_input":
        return (
          <div key={index} className="space-y-2">
            <p className="font-medium text-sm">{response.question}</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {response.response || "No response provided"}
            </p>
          </div>
        )

      case "checkbox":
        return (
          <div key={index} className="space-y-2">
            <p className="font-medium text-sm">{response.question}</p>
            <Badge variant={response.response ? "default" : "secondary"}>{response.response ? "Yes" : "No"}</Badge>
          </div>
        )

      case "photo_upload":
        return (
          <div key={index} className="space-y-2">
            <p className="font-medium text-sm">{response.question}</p>
            <p className="text-xs text-gray-500">Photo upload feature not implemented in POC</p>
          </div>
        )

      default:
        return null
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Audit Reports</h1>
            <p className="text-gray-600">View submitted audit reports (Read-only)</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">All Reports</h2>
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-colors ${
                  selectedReport?.id === report.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.businesses.business_name}</CardTitle>
                    <Badge variant="secondary">{report.businesses.business_categories?.category_name}</Badge>
                  </div>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-3 w-3" />
                      <span>Auditor: {report.users.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>Submitted: {new Date(report.submitted_at).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}

            {reports.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No audit reports submitted yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Reports will appear here once auditors complete their tasks.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            {selectedReport ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Audit Report Details</span>
                  </CardTitle>
                  <CardDescription>This report is read-only and cannot be modified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Business Information</span>
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">{selectedReport.businesses.business_name}</p>
                    <p className="text-blue-700 text-sm">
                      Category: {selectedReport.businesses.business_categories?.category_name}
                    </p>
                    <p className="text-blue-700 text-sm">Auditor: {selectedReport.users.full_name}</p>
                    <p className="text-blue-700 text-sm">
                      Date: {new Date(selectedReport.submitted_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Audit Responses:</h4>
                    {selectedReport.responses.map((response: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg bg-white">
                        {renderResponse(response, index)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">Select a report to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

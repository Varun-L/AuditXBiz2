"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!profile) {
        router.push("/auth/login")
        return
      }

      // Redirect based on user role immediately
      const redirectPath = {
        admin: "/admin",
        auditor: "/auditor",
        supplier: "/supplier",
        consumer: "/consumer",
      }[profile.role]

      if (redirectPath) {
        window.location.href = redirectPath
      }
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Welcome to AuditPro</CardTitle>
          <CardDescription className="text-center">Redirecting you to your dashboard...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Setting up your {profile.role} dashboard...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

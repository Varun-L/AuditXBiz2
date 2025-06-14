"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { signIn } from "@/lib/auth"
import { isDemoMode } from "@/lib/supabase"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await signIn(email, password)

    if (error) {
      setError(error.message)
    } else if (data.user) {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CardTitle className="text-2xl font-bold">AuditX-Biz</CardTitle>
            {isDemoMode && <Badge variant="secondary">Demo Mode</Badge>}
          </div>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Demo Mode:</strong> Supabase is not configured. Use the demo accounts below.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
            <div className="text-xs text-gray-500 space-y-2 bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-600">Admin:</span>
                  <span>admin@auditx.com</span>
                  <span className="font-mono bg-blue-100 px-1 rounded">admin2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-600">Auditor:</span>
                  <span>mike.auditor@auditx.com</span>
                  <span className="font-mono bg-green-100 px-1 rounded">audit123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-orange-600">Supplier:</span>
                  <span>john.supplier@auditx.com</span>
                  <span className="font-mono bg-orange-100 px-1 rounded">supply456</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-purple-600">Consumer:</span>
                  <span>alice.consumer@auditx.com</span>
                  <span className="font-mono bg-purple-100 px-1 rounded">consumer789</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Click on any credential to copy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { demoUsers } from "@/lib/demo-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Info, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const isDemoMode = !isSupabaseConfigured

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isDemoMode) {
        // Demo mode authentication
        const user = demoUsers.find((u) => u.email === email)
        if (user && password === "demo123") {
          localStorage.setItem("demo-user", JSON.stringify(user))

          // Redirect based on role
          switch (user.role) {
            case "admin":
              window.location.href = "/admin"
              break
            case "auditor":
              window.location.href = "/auditor"
              break
            case "supplier":
              window.location.href = "/supplier"
              break
            case "consumer":
              window.location.href = "/consumer"
              break
            default:
              window.location.href = "/dashboard"
          }
        } else {
          throw new Error("Invalid credentials. Use 'demo123' as password for any demo account.")
        }
      } else {
        // Real Supabase authentication
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("demo123")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AuditPro
            </CardTitle>
            {isDemoMode && <Badge variant="secondary">Demo</Badge>}
          </div>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Mode:</strong> Use any demo email with password "demo123"
                <div className="mt-3 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => fillDemoCredentials("admin@auditpro.com")}
                  >
                    <strong>Admin:</strong> admin@auditpro.com
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => fillDemoCredentials("john@auditpro.com")}
                  >
                    <strong>Auditor:</strong> john@auditpro.com
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => fillDemoCredentials("supplier@auditpro.com")}
                  >
                    <strong>Supplier:</strong> supplier@auditpro.com
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-8"
                    onClick={() => fillDemoCredentials("jane@auditpro.com")}
                  >
                    <strong>Consumer:</strong> jane@auditpro.com
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isDemoMode ? "Enter 'demo123'" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {"Don't have an account? "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

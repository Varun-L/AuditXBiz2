"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { signUp } from "@/lib/auth"
import { isDemoMode } from "@/lib/supabase"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    physical_address: "",
    role: "consumer" as const,
    upi_handle: "",
    bank_account_number: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { email, password, ...userData } = formData
    const { data, error } = await signUp(email, password, userData)

    if (error) {
      setError(error.message)
    } else if (data?.user) {
      router.push("/dashboard")
    }

    setLoading(false)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CardTitle className="text-2xl font-bold">Register - AuditX-Biz</CardTitle>
            {isDemoMode && <Badge variant="secondary">Demo Mode</Badge>}
          </div>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <Alert className="mb-4">
              <AlertDescription>
                <strong>Demo Mode:</strong> Registration is disabled. Please use the existing demo accounts from the
                login page.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => updateFormData("full_name", e.target.value)}
                  required
                  disabled={isDemoMode}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                  disabled={isDemoMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                  disabled={isDemoMode}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => updateFormData("phone_number", e.target.value)}
                  disabled={isDemoMode}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="physical_address">Physical Address</Label>
              <Textarea
                id="physical_address"
                value={formData.physical_address}
                onChange={(e) => updateFormData("physical_address", e.target.value)}
                disabled={isDemoMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => updateFormData("role", value)}
                disabled={isDemoMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                  <SelectItem value="supplier">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "auditor" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="upi_handle">UPI Handle</Label>
                  <Input
                    id="upi_handle"
                    value={formData.upi_handle}
                    onChange={(e) => updateFormData("upi_handle", e.target.value)}
                    placeholder="yourname@upi"
                    disabled={isDemoMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Bank Account Number</Label>
                  <Input
                    id="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={(e) => updateFormData("bank_account_number", e.target.value)}
                    disabled={isDemoMode}
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || isDemoMode}>
              {loading ? "Creating Account..." : isDemoMode ? "Registration Disabled in Demo" : "Register"}
            </Button>

            {isDemoMode && (
              <div className="text-center">
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Back to Login
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

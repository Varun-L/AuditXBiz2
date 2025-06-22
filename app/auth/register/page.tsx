"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle } from "lucide-react"
import { Info } from "lucide-react"
import { demoUsers } from "@/lib/demo-data"
import { Badge } from "@/components/ui/badge"

const isDemoMode = !isSupabaseConfigured

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    pinCode: "",
    role: "consumer" as "consumer" | "auditor" | "supplier",
    upiHandle: "",
    bankAccountNumber: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isDemoMode) {
        // Demo mode registration
        const newUser = {
          id: `user-${Date.now()}`,
          role: formData.role,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          pin_code: formData.pinCode,
          upi_handle: formData.role === "auditor" ? formData.upiHandle : null,
          bank_account_number: formData.role === "auditor" ? formData.bankAccountNumber : null,
        }

        // Add to demo users array
        demoUsers.push(newUser)

        toast({
          title: "Success",
          description: "Account created successfully! (Demo Mode) You can now sign in.",
        })

        router.push("/auth/login")
      } else {
        // Real Supabase registration
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (authError) throw authError

        if (authData.user) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: authData.user.id,
            role: formData.role,
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            address: formData.address,
            city: formData.city,
            pin_code: formData.pinCode,
            upi_handle: formData.role === "auditor" ? formData.upiHandle : null,
            bank_account_number: formData.role === "auditor" ? formData.bankAccountNumber : null,
          })

          if (profileError) throw profileError

          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to verify your account.",
          })

          router.push("/auth/login")
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-2xl font-bold text-center">AuditX-Biz</CardTitle>
            {isDemoMode && <Badge variant="secondary">Demo</Badge>}
          </div>
          <CardDescription className="text-center">Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Mode:</strong> Registration will create a demo account. You can then sign in with your
                email and "demo123" as the password.
              </AlertDescription>
            </Alert>
          )}
          {!isSupabaseConfigured && !isDemoMode && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Supabase configuration is required to register. Please check your environment variables.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  placeholder="Enter your PIN code"
                  value={formData.pinCode}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "consumer" | "auditor" | "supplier") =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
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
                  <Label htmlFor="upiHandle">UPI Handle</Label>
                  <Input
                    id="upiHandle"
                    placeholder="Enter your UPI handle"
                    value={formData.upiHandle}
                    onChange={(e) => setFormData({ ...formData, upiHandle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                  <Input
                    id="bankAccountNumber"
                    placeholder="Enter your bank account number"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

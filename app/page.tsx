"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FadeIn } from "@/components/ui/fade-in"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Info,
  Shield,
  FileText,
  Truck,
  Building,
  Package,
  IndianRupee,
  MapPin,
  Phone,
  Map,
  CheckCircle,
  TrendingUp,
  Globe,
  Award,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, profile, loading, isDemoMode } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user && profile) {
        router.push("/dashboard")
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading AuditPro...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user && profile) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-20">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="relative">
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AuditPro
                  </h1>
                  <div className="absolute -top-2 -right-2">
                    {isDemoMode && (
                      <Badge variant="secondary" className="animate-pulse">
                        Demo
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  POC v1.0
                </Badge>
              </div>
              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Revolutionary transparency platform connecting businesses with independent auditors. Combat fake reviews
                with <span className="font-semibold text-blue-600">verifiable audit reports</span> and build genuine
                customer trust.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    <AnimatedCounter end={500} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-600">Businesses Audited</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    <AnimatedCounter end={150} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-600">Certified Auditors</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    <AnimatedCounter end={98} suffix="%" />
                  </div>
                  <p className="text-sm text-gray-600">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    <AnimatedCounter end={25} suffix="+" />
                  </div>
                  <p className="text-sm text-gray-600">Cities Covered</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {isDemoMode && (
            <FadeIn delay={200}>
              <div className="max-w-3xl mx-auto mb-12">
                <Alert className="border-amber-200 bg-amber-50">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Experience Demo Mode</AlertTitle>
                  <AlertDescription className="mt-2 text-amber-700">
                    Explore all features with sample data. Try these demo accounts:
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 p-3 rounded-lg text-sm">
                        <strong className="text-blue-700">Admin Dashboard:</strong> admin@auditpro.com / demo123
                      </div>
                      <div className="bg-white/60 p-3 rounded-lg text-sm">
                        <strong className="text-green-700">Field Auditor:</strong> john@auditpro.com / demo123
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </FadeIn>
          )}

          {/* CTA Buttons */}
          <FadeIn delay={400}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
              <Link href="/onboard/business">
                <Button variant="outline" size="lg" className="border-2 hover:bg-blue-50 transition-all duration-200">
                  <Building className="h-5 w-5 mr-2" />
                  Register Business
                </Button>
              </Link>
              <Link href="/test-location">
                <Button variant="ghost" size="lg" className="hover:bg-white/50 transition-all duration-200">
                  <Map className="h-5 w-5 mr-2" />
                  Test Location Features
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Why Choose AuditPro?</h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Built for transparency, powered by technology, trusted by businesses
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FadeIn delay={100}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">100% Transparent</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Every audit is documented with photos, ratings, and detailed reports. No hidden information.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={200}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Location-Based</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Smart assignment system connects businesses with nearest auditors and suppliers automatically.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Certified Auditors</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    All auditors are verified, trained, and rated by the community for quality assurance.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Self-Onboarding Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Join the Network</h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Whether you're a business owner, auditor, or delivery partner - there's a place for you
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FadeIn delay={100}>
              <Card className="border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 group-hover:bg-blue-200 rounded-lg p-2 transition-colors duration-200">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-blue-600">Business Owner</CardTitle>
                  </div>
                  <CardDescription>Get your business audited and build customer trust</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Submit business details online</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Auto-assign nearest auditor & supplier</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Get transparent audit report</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Boost customer confidence</span>
                    </div>
                  </div>
                  <Link href="/onboard/business">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                      Register Business
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={200}>
              <Card className="border-2 border-green-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 group-hover:bg-green-200 rounded-lg p-2 transition-colors duration-200">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl text-green-600">Become an Auditor</CardTitle>
                  </div>
                  <CardDescription>Join as an independent auditor and earn money</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Earn ₹150-250 per audit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Work in your local area</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Mobile app for field work</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Flexible working hours</span>
                    </div>
                  </div>
                  <Link href="/onboard/auditor">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-green-600 hover:bg-green-50 transition-colors duration-200"
                    >
                      Apply as Auditor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={300}>
              <Card className="border-2 border-orange-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 group-hover:bg-orange-200 rounded-lg p-2 transition-colors duration-200">
                      <Truck className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl text-orange-600">Delivery Partner</CardTitle>
                  </div>
                  <CardDescription>Join as a supplier/delivery partner</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Deliver onboarding kits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Local delivery routes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Mobile app for tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Expand your network</span>
                    </div>
                  </div>
                  <Link href="/onboard/supplier">
                    <Button
                      variant="outline"
                      className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors duration-200"
                    >
                      Join as Partner
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Simple, transparent, and efficient process from registration to audit report
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FadeIn delay={100}>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Building className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">1. Business Registers</h3>
                <p className="text-gray-600">Business owner submits details via secure online form with location</p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">2. Smart Assignment</h3>
                <p className="text-gray-600">Nearest supplier and auditor automatically assigned based on location</p>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">3. Audit Conducted</h3>
                <p className="text-gray-600">Certified auditor visits and completes comprehensive checklist</p>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3">4. Report Published</h3>
                <p className="text-gray-600">Transparent audit report made public with photos and ratings</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Admin Access */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-12 rounded-2xl shadow-2xl text-white">
              <h2 className="text-3xl font-bold mb-4">Platform Administration</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Comprehensive admin dashboard for managing users, businesses, categories, and monitoring all platform
                activities with real-time analytics
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
                <Link href="/test-location">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <Map className="h-5 w-5 mr-2" />
                    Test Location Features
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">AuditPro</h3>
            <p className="text-gray-400 mb-6">Building trust through transparency</p>
            <div className="flex justify-center space-x-6">
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                POC v1.0
              </Badge>
              {isDemoMode && (
                <Badge variant="secondary" className="bg-amber-600">
                  Demo Mode
                </Badge>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

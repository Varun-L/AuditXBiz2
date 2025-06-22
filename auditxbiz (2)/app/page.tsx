import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, CheckCircle, Truck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AuditXBiz</h1>
            </div>
            <nav className="flex space-x-4">
              <Link href="/admin">
                <Button variant="outline">Admin Portal</Button>
              </Link>
              <Link href="/auditor">
                <Button variant="outline">Auditor App</Button>
              </Link>
              <Link href="/supplier">
                <Button variant="outline">Supplier App</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Geo-Based Business Auditing Platform</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline business audits, kit deliveries, and onboarding with location-intelligent task assignment and
            real-time transparency.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/onboard/business">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Register Your Business
              </Button>
            </Link>
            <Link href="/onboard/auditor">
              <Button size="lg" variant="outline">
                Become an Auditor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Location Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatic assignment of nearest auditors and suppliers using PostGIS geographic queries for optimal
                  efficiency.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Multi-Role Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Supports Admins, Auditors, Suppliers, and Business Owners with role-specific interfaces and
                  permissions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Dynamic Checklists</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  JSON-configurable audit checklists with photo uploads, ratings, and custom questions per business
                  category.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 text-orange-600 mb-4" />
                <CardTitle>Kit Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automated onboarding kit delivery tracking with real-time status updates from suppliers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Businesses Audited</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Active Auditors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Delivery Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join our platform and experience transparent, efficient business auditing.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/onboard/business">
              <Button size="lg" variant="secondary">
                Register Business
              </Button>
            </Link>
            <Link href="/onboard/supplier">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                Become a Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">AuditXBiz</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing business auditing with location intelligence and transparency.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/admin" className="hover:text-white">
                    Admin Portal
                  </Link>
                </li>
                <li>
                  <Link href="/auditor" className="hover:text-white">
                    Auditor App
                  </Link>
                </li>
                <li>
                  <Link href="/supplier" className="hover:text-white">
                    Supplier App
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/onboard/business" className="hover:text-white">
                    Register Business
                  </Link>
                </li>
                <li>
                  <Link href="/onboard/auditor" className="hover:text-white">
                    Become Auditor
                  </Link>
                </li>
                <li>
                  <Link href="/onboard/supplier" className="hover:text-white">
                    Become Supplier
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:support@auditxbiz.com" className="hover:text-white">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="tel:+91-9999999999" className="hover:text-white">
                    +91-9999999999
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AuditXBiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

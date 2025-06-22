"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  Package,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"

export default function VipanaDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for detailed Vipana view
  const vipana = {
    id: params.id,
    name: "Cafe Mumbai",
    owner: "Rajesh Patel",
    category: "Restaurant",
    status: "certified",
    score: 85.5,
    location: "Andheri West, Mumbai",
    address: "Shop 12, Link Road, Andheri West, Mumbai - 400053",
    phone: "+91-9876543210",
    email: "rajesh@cafemumbai.com",
    canListProducts: true,
    certifiedAt: "2024-01-15",
    lastAudit: "2024-01-15",
    coordinates: { lat: 19.1334, lng: 72.8267 },
  }

  const products = [
    {
      id: "1",
      name: "Special Masala Chai",
      description: "Authentic Mumbai style masala chai",
      price: 25,
      category: "Beverages",
      images: ["/placeholder.svg?height=200&width=200"],
      isActive: true,
      views: 245,
      orders: 67,
    },
    {
      id: "2",
      name: "Vada Pav",
      description: "Mumbai's favorite street food",
      price: 35,
      category: "Snacks",
      images: ["/placeholder.svg?height=200&width=200"],
      isActive: true,
      views: 189,
      orders: 43,
    },
  ]

  const reviews = [
    {
      id: "1",
      consumerName: "Priya S.",
      rating: 5,
      comment: "Excellent food quality and service!",
      createdAt: "2024-01-16",
      isFlagged: false,
      isVerified: true,
    },
    {
      id: "2",
      consumerName: "Anonymous",
      rating: 1,
      comment: "Terrible experience, very poor quality",
      createdAt: "2024-01-15",
      isFlagged: true,
      isVerified: false,
      flagReason: "Suspicious - multiple negative reviews from same IP",
    },
  ]

  const auditHistory = [
    {
      id: "1",
      auditorName: "Rajesh Kumar",
      score: 85.5,
      completedAt: "2024-01-15",
      duration: 45,
      status: "completed",
      checklist: {
        cleanliness: 9,
        service: 8,
        compliance: 8,
        overall: 8.5,
      },
    },
  ]

  const analytics = {
    totalViews: 1250,
    totalOrders: 89,
    conversionRate: 7.1,
    avgRating: 4.2,
    totalReviews: 45,
    monthlyRevenue: 15600,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vipana.name}</h1>
                <p className="text-sm text-gray-500">Vipana Details & Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  vipana.status === "certified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }
              >
                {vipana.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Certification Score</p>
                  <p className="text-2xl font-bold text-green-600">{vipana.score}/100</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold">{analytics.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Rating</p>
                  <p className="text-2xl font-bold flex items-center">
                    {analytics.avgRating}
                    <Star className="h-5 w-5 text-yellow-500 ml-1" />
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="audits">Audit History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Category:</span>
                    <span>{vipana.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Address:</span>
                    <span>{vipana.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span>{vipana.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Email:</span>
                    <span>{vipana.email}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Certified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Score:</span>
                    <span className="font-semibold">{vipana.score}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Certified Date:</span>
                    <span>{new Date(vipana.certifiedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Product Listing:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Enabled
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Product Catalog</h3>
                <p className="text-sm text-gray-500">Manage products listed on the platform</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold">₹{product.price}</span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div>
                        <span>Views: {product.views}</span>
                      </div>
                      <div>
                        <span>Orders: {product.orders}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <p className="text-sm text-gray-500">Monitor and moderate customer feedback</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Export Reviews
                </Button>
                <Button variant="outline" size="sm">
                  Moderate Flagged
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.consumerName}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        {review.isFlagged && <Badge variant="destructive">Flagged</Badge>}
                        {!review.isVerified && <Badge variant="outline">Unverified</Badge>}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm mb-2">{review.comment}</p>
                    {review.isFlagged && review.flagReason && (
                      <div className="bg-red-50 p-2 rounded text-sm text-red-800 mb-2">
                        <strong>Flag Reason:</strong> {review.flagReason}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      {review.isFlagged ? (
                        <>
                          <Button size="sm" variant="outline">
                            Approve Review
                          </Button>
                          <Button size="sm" variant="destructive">
                            Delete Review
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline">
                          Flag as Suspicious
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Administrative Actions</CardTitle>
                <CardDescription>Perform administrative tasks for this Vipana</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Certification Management</h4>
                    <div className="space-y-2">
                      <Button className="w-full justify-start">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Request Re-audit
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="h-4 w-4 mr-2" />
                        Override Score
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Suspend Certification
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Product Management</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Enable Product Listing
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        Review Product Catalog
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Sales Analytics
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Score Override</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newScore">New Score (0-100)</Label>
                        <Input id="newScore" type="number" min="0" max="100" placeholder="85.5" />
                      </div>
                      <div>
                        <Label htmlFor="currentScore">Current Score</Label>
                        <Input id="currentScore" value={vipana.score} disabled />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="overrideReason">Reason for Override</Label>
                      <Textarea
                        id="overrideReason"
                        placeholder="Provide detailed justification for score override..."
                        rows={3}
                      />
                    </div>
                    <Button>Submit Score Override</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="audits">
            <Card>
              <CardHeader>
                <CardTitle>Audit History</CardTitle>
                <CardDescription>View all audit records for this Vipana</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Audit history interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Detailed analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

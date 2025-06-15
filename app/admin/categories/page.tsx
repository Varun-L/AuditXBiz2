"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowLeft, Plus, ChevronDown, ChevronRight } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/layout/navbar"
import BusinessCategoryForm from "@/components/admin/business-category-form"

interface BusinessCategory {
  id: string
  category_name: string
  payout_amount: number
  checklist: any
  checklist_yaml?: string
  created_at: string
}

export default function CategoriesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<BusinessCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
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
      fetchCategories()
    }
    fetchUser()
  }, [router])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("business_categories")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setCategories(data)
    }
    setLoading(false)
  }

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Categories</h1>
              <p className="text-gray-600">Manage business categories and audit checklists (YAML format)</p>
            </div>
          </div>

          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add Category"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {showForm && (
            <div className="lg:col-span-2">
              <BusinessCategoryForm
                onSuccess={() => {
                  setShowForm(false)
                  fetchCategories()
                }}
              />
            </div>
          )}

          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{category.category_name}</CardTitle>
                      <Badge variant="secondary">₹{(category.payout_amount / 100).toFixed(2)} payout</Badge>
                    </div>
                    <CardDescription>Created on {new Date(category.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Collapsible>
                      <CollapsibleTrigger
                        className="flex items-center space-x-2 text-sm font-medium hover:text-blue-600 transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span>View Audit Checklist ({category.checklist?.checklist?.length || 0} questions)</span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Questions Overview:</h4>
                            <div className="bg-gray-50 p-3 rounded-md space-y-2">
                              {category.checklist?.checklist?.map((item: any, index: number) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">{index + 1}. </span>
                                  {item.question}
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {item.type}
                                  </Badge>
                                  {item.type === "rating" && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({item.min}-{item.max})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {category.checklist_yaml && (
                            <div>
                              <h4 className="font-medium mb-2">YAML Configuration:</h4>
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                                {category.checklist_yaml}
                              </pre>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}

              {categories.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No business categories created yet.</p>
                    <Button className="mt-4" onClick={() => setShowForm(true)}>
                      Create First Category
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


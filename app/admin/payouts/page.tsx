"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, DollarSign, TrendingUp, Users, Calendar } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import Navbar from "@/components/layout/navbar"

interface PayoutSummary {
  auditor_name: string
  auditor_id: string
  total_completed: number
  total_earnings: number
  pending_amount: number
  paid_amount: number
  last_payout_date?: string
}

export default function PayoutsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [payoutSummaries, setPayoutSummaries] = useState<PayoutSummary[]>([])
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
      fetchPayoutData()
    }
    fetchUser()
  }, [router])

  const fetchPayoutData = async () => {
    // Mock payout data for demo
    setPayoutSummaries([
      {
        auditor_name: "Mike Auditor",
        auditor_id: "demo-auditor-id",
        total_completed: 4,
        total_earnings: 85000, // ₹850 in paise
        pending_amount: 65000, // ₹650 pending
        paid_amount: 20000, // ₹200 paid
        last_payout_date: "2024-01-20T00:00:00Z",
      },
      {
        auditor_name: "Priya Singh",
        auditor_id: "auditor-2",
        total_completed: 2,
        total_earnings: 45000, // ₹450 in paise
        pending_amount: 45000, // ₹450 pending
        paid_amount: 0,
      },
      {
        auditor_name: "Rajesh Kumar",
        auditor_id: "auditor-3",
        total_completed: 6,
        total_earnings: 120000, // ₹1200 in paise
        pending_amount: 30000, // ₹300 pending
        paid_amount: 90000, // ₹900 paid
        last_payout_date: "2024-01-25T00:00:00Z",
      },
    ])
    setLoading(false)
  }

  const totalStats = payoutSummaries.reduce(
    (acc, summary) => ({
      totalAuditors: acc.totalAuditors + 1,
      totalEarnings: acc.totalEarnings + summary.total_earnings,
      totalPending: acc.totalPending + summary.pending_amount,
      totalPaid: acc.totalPaid + summary.paid_amount,
      totalCompleted: acc.totalCompleted + summary.total_completed,
    }),
    { totalAuditors: 0, totalEarnings: 0, totalPending: 0, totalPaid: 0, totalCompleted: 0 },
  )

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
            <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
            <p className="text-gray-600">Monitor and manage auditor payouts</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Auditors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalAuditors}</div>
              <p className="text-xs text-muted-foreground">Active auditors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{(totalStats.totalEarnings / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₹{(totalStats.totalPending / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalCompleted}</div>
              <p className="text-xs text-muted-foreground">Total audits</p>
            </CardContent>
          </Card>
        </div>

        {/* Auditor Payout Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Auditor Payout Details</h2>
          {payoutSummaries.map((summary) => (
            <Card key={summary.auditor_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{summary.auditor_name}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline">{summary.total_completed} audits completed</Badge>
                    {summary.pending_amount > 0 && (
                      <Badge className="bg-orange-100 text-orange-800">
                        ₹{(summary.pending_amount / 100).toFixed(2)} pending
                      </Badge>
                    )}
                  </div>
                </div>
                {summary.last_payout_date && (
                  <CardDescription>
                    Last payout: {new Date(summary.last_payout_date).toLocaleDateString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Earnings</p>
                    <p className="text-lg font-semibold">₹{(summary.total_earnings / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Paid Amount</p>
                    <p className="text-lg font-semibold text-green-600">₹{(summary.paid_amount / 100).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pending Amount</p>
                    <p className="text-lg font-semibold text-orange-600">
                      ₹{(summary.pending_amount / 100).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-end">
                    {summary.pending_amount > 0 && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Process Payout
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

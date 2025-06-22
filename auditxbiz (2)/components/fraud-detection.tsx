"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, CheckCircle, X, Clock } from "lucide-react"

interface FraudAlert {
  id: string
  type: string
  description: string
  severity: "low" | "medium" | "high"
  status: "pending" | "investigating" | "resolved" | "dismissed"
  entityType: string
  entityId: string
  createdAt: string
  metadata?: any
}

export function FraudDetectionSystem() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [loading, setLoading] = useState(true)

  // Mock fraud detection rules
  const fraudRules = {
    duplicateReviews: {
      enabled: true,
      threshold: 3, // Max reviews from same IP/device
      timeWindow: 24, // hours
    },
    fastAudits: {
      enabled: true,
      minDuration: 15, // minutes
      maxAuditsPerHour: 3,
    },
    gpsDeviation: {
      enabled: true,
      maxDistance: 100, // meters from business location
    },
    suspiciousPatterns: {
      enabled: true,
      checkReviewTiming: true,
      checkRatingPatterns: true,
    },
  }

  useEffect(() => {
    // Simulate loading fraud alerts
    setTimeout(() => {
      setAlerts([
        {
          id: "1",
          type: "duplicate_review",
          description: "5 negative reviews from IP 192.168.1.100 for Cafe Mumbai in last 2 hours",
          severity: "high",
          status: "pending",
          entityType: "review",
          entityId: "cafe-mumbai-reviews",
          createdAt: "2024-01-16T10:30:00Z",
          metadata: { ipAddress: "192.168.1.100", reviewCount: 5, businessId: "cafe-mumbai" },
        },
        {
          id: "2",
          type: "fast_audit",
          description: "Audit completed in 8 minutes by Samikshak Amit Patel (minimum 15 minutes required)",
          severity: "medium",
          status: "investigating",
          entityType: "audit",
          entityId: "audit-12345",
          createdAt: "2024-01-16T09:15:00Z",
          metadata: { auditorId: "amit-patel", duration: 8, businessId: "tech-store" },
        },
        {
          id: "3",
          type: "gps_mismatch",
          description: "GPS location 250m away from business address during audit",
          severity: "high",
          status: "resolved",
          entityType: "audit",
          entityId: "audit-12346",
          createdAt: "2024-01-15T14:20:00Z",
          metadata: { distance: 250, auditorId: "rajesh-kumar", businessId: "service-center" },
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const handleAlertAction = (alertId: string, action: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: action as any } : alert)))
    console.log(`Alert ${alertId} marked as ${action}`)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            Loading fraud alerts...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Fraud Detection Rules Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Fraud Detection Rules
          </CardTitle>
          <CardDescription>Active monitoring rules and thresholds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Duplicate Reviews</h4>
              <p className="text-xs text-gray-500">
                Max {fraudRules.duplicateReviews.threshold} per IP in {fraudRules.duplicateReviews.timeWindow}h
              </p>
              <Badge variant="outline" className="mt-1">
                {fraudRules.duplicateReviews.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Fast Audits</h4>
              <p className="text-xs text-gray-500">Min {fraudRules.fastAudits.minDuration}min duration</p>
              <Badge variant="outline" className="mt-1">
                {fraudRules.fastAudits.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">GPS Deviation</h4>
              <p className="text-xs text-gray-500">Max {fraudRules.gpsDeviation.maxDistance}m from location</p>
              <Badge variant="outline" className="mt-1">
                {fraudRules.gpsDeviation.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Pattern Analysis</h4>
              <p className="text-xs text-gray-500">Behavioral anomaly detection</p>
              <Badge variant="outline" className="mt-1">
                {fraudRules.suspiciousPatterns.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Fraud Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Active Fraud Alerts ({alerts.filter((a) => a.status === "pending" || a.status === "investigating").length})
          </CardTitle>
          <CardDescription>Suspicious activities requiring investigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {alert.entityType} • {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-sm mb-3">{alert.description}</p>

                {alert.metadata && (
                  <div className="bg-gray-50 p-3 rounded text-xs mb-3">
                    <strong>Details:</strong>
                    {Object.entries(alert.metadata).map(([key, value]) => (
                      <span key={key} className="ml-2">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  {alert.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handleAlertAction(alert.id, "investigating")}>
                        <Eye className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert.id, "dismissed")}>
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </>
                  )}
                  {alert.status === "investigating" && (
                    <>
                      <Button size="sm" onClick={() => handleAlertAction(alert.id, "resolved")}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert.id, "dismissed")}>
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </>
                  )}
                  {(alert.status === "resolved" || alert.status === "dismissed") && (
                    <Badge variant="outline" className="text-xs">
                      {alert.status === "resolved" ? "Resolved" : "Dismissed"}
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No fraud alerts detected</p>
                <p className="text-sm">All systems operating normally</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

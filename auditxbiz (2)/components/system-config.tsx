"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, RotateCcw, Tag, Calculator, Shield, MessageSquare } from "lucide-react"

export function SystemConfiguration() {
  const [config, setConfig] = useState({
    labels: {
      vipana: "Vipana",
      samikshak: "Samikshak",
      ariya: "Ariya",
    },
    scoring: {
      certificationThreshold: 70,
      weights: {
        cleanliness: 30,
        service: 25,
        compliance: 45,
      },
    },
    fraudDetection: {
      maxAuditsPerHour: 3,
      minAuditDuration: 15,
      maxGpsDeviation: 100,
      duplicateReviewThreshold: 3,
    },
    payments: {
      autoPaymentThreshold: {
        supplier: 10000,
        auditor: 5000,
      },
      paymentSchedule: "weekly",
    },
    messages: {
      welcomeMessage: "Welcome to AuditXBiz platform",
      auditInstructions: "Please complete all required fields and upload photos",
      certificationMessage: "Congratulations! Your business has been certified.",
    },
  })

  const handleConfigChange = (section: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleNestedConfigChange = (section: string, subsection: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value,
        },
      },
    }))
  }

  const saveConfiguration = () => {
    console.log("Saving configuration:", config)
    alert("Configuration saved successfully!")
  }

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      // Reset logic here
      alert("Configuration reset to defaults!")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>Manage platform settings, labels, and operational parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-2 mb-6">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={saveConfiguration}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>

          <Tabs defaultValue="labels" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="labels">Labels</TabsTrigger>
              <TabsTrigger value="scoring">Scoring</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            {/* Labels Configuration */}
            <TabsContent value="labels" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Platform Labels
                  </CardTitle>
                  <CardDescription>Customize user-facing labels and terminology</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vipanaLabel">Business Owner Label</Label>
                      <Input
                        id="vipanaLabel"
                        value={config.labels.vipana}
                        onChange={(e) => handleConfigChange("labels", "vipana", e.target.value)}
                        placeholder="e.g., Vipana, Business Owner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="samikshakLabel">Auditor Label</Label>
                      <Input
                        id="samikshakLabel"
                        value={config.labels.samikshak}
                        onChange={(e) => handleConfigChange("labels", "samikshak", e.target.value)}
                        placeholder="e.g., Samikshak, Auditor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ariyaLabel">Consumer Label</Label>
                      <Input
                        id="ariyaLabel"
                        value={config.labels.ariya}
                        onChange={(e) => handleConfigChange("labels", "ariya", e.target.value)}
                        placeholder="e.g., Ariya, Consumer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scoring Configuration */}
            <TabsContent value="scoring" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Scoring System
                  </CardTitle>
                  <CardDescription>Configure certification thresholds and scoring weights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="certThreshold">Certification Threshold (0-100)</Label>
                    <Input
                      id="certThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={config.scoring.certificationThreshold}
                      onChange={(e) =>
                        handleConfigChange("scoring", "certificationThreshold", Number.parseInt(e.target.value))
                      }
                    />
                    <p className="text-xs text-gray-500">Minimum score required for business certification</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Scoring Weights (%)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cleanlinessWeight">Cleanliness</Label>
                        <Input
                          id="cleanlinessWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={config.scoring.weights.cleanliness}
                          onChange={(e) =>
                            handleNestedConfigChange(
                              "scoring",
                              "weights",
                              "cleanliness",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="serviceWeight">Service Quality</Label>
                        <Input
                          id="serviceWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={config.scoring.weights.service}
                          onChange={(e) =>
                            handleNestedConfigChange("scoring", "weights", "service", Number.parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="complianceWeight">Compliance</Label>
                        <Input
                          id="complianceWeight"
                          type="number"
                          min="0"
                          max="100"
                          value={config.scoring.weights.compliance}
                          onChange={(e) =>
                            handleNestedConfigChange(
                              "scoring",
                              "weights",
                              "compliance",
                              Number.parseInt(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Total weight: {Object.values(config.scoring.weights).reduce((a, b) => a + b, 0)}% (should equal
                      100%)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fraud Detection Configuration */}
            <TabsContent value="fraud" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Fraud Detection Rules
                  </CardTitle>
                  <CardDescription>Configure automated fraud detection parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxAuditsPerHour">Max Audits Per Hour</Label>
                      <Input
                        id="maxAuditsPerHour"
                        type="number"
                        min="1"
                        value={config.fraudDetection.maxAuditsPerHour}
                        onChange={(e) =>
                          handleConfigChange("fraudDetection", "maxAuditsPerHour", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minAuditDuration">Min Audit Duration (minutes)</Label>
                      <Input
                        id="minAuditDuration"
                        type="number"
                        min="1"
                        value={config.fraudDetection.minAuditDuration}
                        onChange={(e) =>
                          handleConfigChange("fraudDetection", "minAuditDuration", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxGpsDeviation">Max GPS Deviation (meters)</Label>
                      <Input
                        id="maxGpsDeviation"
                        type="number"
                        min="1"
                        value={config.fraudDetection.maxGpsDeviation}
                        onChange={(e) =>
                          handleConfigChange("fraudDetection", "maxGpsDeviation", Number.parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duplicateReviewThreshold">Duplicate Review Threshold</Label>
                      <Input
                        id="duplicateReviewThreshold"
                        type="number"
                        min="1"
                        value={config.fraudDetection.duplicateReviewThreshold}
                        onChange={(e) =>
                          handleConfigChange(
                            "fraudDetection",
                            "duplicateReviewThreshold",
                            Number.parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Configuration */}
            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Configure automatic payment thresholds and schedules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierThreshold">Supplier Auto-Payment Threshold (₹)</Label>
                      <Input
                        id="supplierThreshold"
                        type="number"
                        value={config.payments.autoPaymentThreshold.supplier}
                        onChange={(e) =>
                          handleNestedConfigChange(
                            "payments",
                            "autoPaymentThreshold",
                            "supplier",
                            Number.parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="auditorThreshold">Auditor Auto-Payment Threshold (₹)</Label>
                      <Input
                        id="auditorThreshold"
                        type="number"
                        value={config.payments.autoPaymentThreshold.auditor}
                        onChange={(e) =>
                          handleNestedConfigChange(
                            "payments",
                            "autoPaymentThreshold",
                            "auditor",
                            Number.parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Configuration */}
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    System Messages
                  </CardTitle>
                  <CardDescription>Customize system messages and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={config.messages.welcomeMessage}
                      onChange={(e) => handleConfigChange("messages", "welcomeMessage", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auditInstructions">Audit Instructions</Label>
                    <Textarea
                      id="auditInstructions"
                      value={config.messages.auditInstructions}
                      onChange={(e) => handleConfigChange("messages", "auditInstructions", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificationMessage">Certification Success Message</Label>
                    <Textarea
                      id="certificationMessage"
                      value={config.messages.certificationMessage}
                      onChange={(e) => handleConfigChange("messages", "certificationMessage", e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

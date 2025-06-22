import { supabase } from "../supabase-client"
import type { FraudAlert } from "../supabase-client"

export async function getFraudAlerts(): Promise<FraudAlert[]> {
  const { data, error } = await supabase.from("fraud_alerts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching fraud alerts:", error)
    throw error
  }

  return data || []
}

export async function updateFraudAlertStatus(
  alertId: string,
  status: "investigating" | "resolved" | "dismissed",
  resolutionNotes?: string,
): Promise<void> {
  const updateData: any = {
    status,
    resolved_at: status === "resolved" ? new Date().toISOString() : null,
  }

  if (resolutionNotes) {
    updateData.resolution_notes = resolutionNotes
  }

  const { error } = await supabase.from("fraud_alerts").update(updateData).eq("id", alertId)

  if (error) {
    console.error("Error updating fraud alert:", error)
    throw error
  }
}

export async function createFraudAlert(
  alertType: string,
  entityType: string,
  entityId: string,
  description: string,
  severity: "low" | "medium" | "high" = "medium",
): Promise<FraudAlert> {
  const { data, error } = await supabase
    .from("fraud_alerts")
    .insert({
      alert_type: alertType,
      entity_type: entityType,
      entity_id: entityId,
      description,
      severity,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating fraud alert:", error)
    throw error
  }

  return data
}

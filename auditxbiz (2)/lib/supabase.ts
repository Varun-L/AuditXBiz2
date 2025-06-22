import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  email: string
  role: "admin" | "auditor" | "supplier" | "business" | "consumer"
  full_name: string
  phone?: string
  location?: any // PostGIS geography type
  address?: string
  aadhaar_number?: string
  driving_license?: string
  upi_id?: string
  bank_account?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  name: string
  category_id: string
  owner_name?: string
  owner_phone?: string
  owner_email?: string
  location: any // PostGIS geography type
  address: string
  license_number?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  checklist_template: any // JSON
  payout_amount: number
  created_at: string
}

export interface AuditTask {
  id: string
  business_id: string
  auditor_id?: string
  category_id: string
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  checklist_responses?: any // JSON
  photos?: string[]
  payout_amount?: number
  assigned_at?: string
  completed_at?: string
  created_at: string
}

export interface DeliveryTask {
  id: string
  business_id: string
  supplier_id?: string
  status: "to_do" | "in_progress" | "shipped" | "delivered"
  tracking_number?: string
  assigned_at?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
}

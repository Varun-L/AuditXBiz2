import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Check if we have valid Supabase configuration
const hasValidConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!hasValidConfig && typeof window !== "undefined") {
  console.warn(
    "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidConfig

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "admin" | "business" | "auditor" | "supplier" | "consumer"
          full_name: string
          email: string
          phone_number: string | null
          address: string | null
          city: string | null
          pin_code: string | null
          aadhaar_card_url: string | null
          pan_card_url: string | null
          driving_license_url: string | null
          upi_handle: string | null
          bank_account_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: "admin" | "business" | "auditor" | "supplier" | "consumer"
          full_name: string
          email: string
          phone_number?: string | null
          address?: string | null
          city?: string | null
          pin_code?: string | null
          aadhaar_card_url?: string | null
          pan_card_url?: string | null
          driving_license_url?: string | null
          upi_handle?: string | null
          bank_account_number?: string | null
        }
        Update: {
          role?: "admin" | "business" | "auditor" | "supplier" | "consumer"
          full_name?: string
          email?: string
          phone_number?: string | null
          address?: string | null
          city?: string | null
          pin_code?: string | null
          aadhaar_card_url?: string | null
          pan_card_url?: string | null
          driving_license_url?: string | null
          upi_handle?: string | null
          bank_account_number?: string | null
        }
      }
      business_categories: {
        Row: {
          id: string
          name: string
          payout_amount: number
          checklist: any
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          payout_amount: number
          checklist: any
        }
        Update: {
          name?: string
          payout_amount?: number
          checklist?: any
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          category_id: string
          address: string
          city: string
          pin_code: string
          phone_number: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          category_id: string
          address: string
          city: string
          pin_code: string
          phone_number?: string | null
          email?: string | null
        }
        Update: {
          name?: string
          category_id?: string
          address?: string
          city?: string
          pin_code?: string
          phone_number?: string | null
          email?: string | null
        }
      }
    }
  }
}

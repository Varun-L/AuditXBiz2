import { createClient } from "@supabase/supabase-js"
import { createDemoSupabaseClient } from "./demo-supabase"

// Fallback values for development/demo purposes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key"

// Check if we're in a demo environment
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (isDemoMode && typeof window !== "undefined") {
  console.warn("⚠️ Running in demo mode. Supabase environment variables not configured.")
}

// Create either real or demo Supabase client
export const supabase = isDemoMode ? (createDemoSupabaseClient() as any) : createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const createServerClient = () => {
  if (isDemoMode) {
    return createDemoSupabaseClient() as any
  }
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "demo-server-key"
  return createClient(supabaseUrl, serverKey)
}

// Export demo mode flag for components to use
export { isDemoMode }

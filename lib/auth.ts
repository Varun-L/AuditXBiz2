import { supabase, isDemoMode } from "./supabase"

export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "business" | "auditor" | "supplier" | "consumer"
  phone_number?: string
  physical_address?: string
}

// Demo users for when Supabase is not configured
const demoUsers: Record<string, { user: User; password: string }> = {
  "admin@auditx.com": {
    user: {
      id: "demo-admin-id",
      email: "admin@auditx.com",
      full_name: "System Administrator",
      role: "admin",
    },
    password: "admin2024",
  },
  "mike.auditor@auditx.com": {
    user: {
      id: "demo-auditor-id",
      email: "mike.auditor@auditx.com",
      full_name: "Mike Auditor",
      role: "auditor",
      phone_number: "+91-9876543212",
      physical_address: "789 Audit Avenue, Bangalore",
    },
    password: "audit123",
  },
  "john.supplier@auditx.com": {
    user: {
      id: "demo-supplier-id",
      email: "john.supplier@auditx.com",
      full_name: "John Supplier",
      role: "supplier",
      phone_number: "+91-9876543210",
      physical_address: "123 Supplier Street, Mumbai",
    },
    password: "supply456",
  },
  "alice.consumer@auditx.com": {
    user: {
      id: "demo-consumer-id",
      email: "alice.consumer@auditx.com",
      full_name: "Alice Consumer",
      role: "consumer",
      phone_number: "+91-9876543214",
      physical_address: "654 Consumer Colony, Mumbai",
    },
    password: "consumer789",
  },
}

export const signIn = async (email: string, password: string) => {
  if (isDemoMode) {
    // Demo mode authentication
    const demoAccount = demoUsers[email]
    if (demoAccount && demoAccount.password === password) {
      // Store demo user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("demo-user", JSON.stringify(demoAccount.user))
      }
      return {
        data: { user: { id: demoAccount.user.id, email } },
        error: null,
      }
    } else {
      return {
        data: null,
        error: { message: "Invalid credentials. Please check email and password." },
      }
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  if (isDemoMode) {
    return {
      data: null,
      error: { message: "Registration is disabled in demo mode. Use existing demo accounts." },
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (data.user && !error) {
    // Insert user data into our users table
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      ...userData,
    })

    if (insertError) {
      return { data: null, error: insertError }
    }
  }

  return { data, error }
}

export const signOut = async () => {
  if (isDemoMode) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo-user")
    }
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<User | null> => {
  if (isDemoMode) {
    if (typeof window !== "undefined") {
      const demoUser = localStorage.getItem("demo-user")
      return demoUser ? JSON.parse(demoUser) : null
    }
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return userData
}

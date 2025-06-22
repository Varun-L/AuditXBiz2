"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { demoAuth } from "@/lib/demo-data"

type Profile = {
  id: string
  role: "admin" | "business" | "auditor" | "supplier" | "consumer"
  full_name: string
  email: string
  phone_number?: string
  address?: string
  city?: string
  pin_code?: string
}

type AuthContextType = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  isConfigured: boolean
  isDemoMode: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  isConfigured: false,
  isDemoMode: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemoMode = !isSupabaseConfigured

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - check for stored demo user
      const storedUser = localStorage.getItem("demo-user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setProfile(userData)
          setUser({ id: userData.id, email: userData.email } as User)
        } catch (error) {
          console.error("Error parsing stored demo user:", error)
          localStorage.removeItem("demo-user")
        }
      }
      setLoading(false)
      return
    }

    // Real Supabase mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [isDemoMode])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      if (isDemoMode) {
        // Clear demo user data
        localStorage.removeItem("demo-user")
        setUser(null)
        setProfile(null)
        demoAuth.signOut()
      } else {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error("Error signing out:", error)
        }
        // Clear local state regardless of error
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Error during sign out:", error)
      // Clear local state even if there's an error
      setUser(null)
      setProfile(null)
      if (isDemoMode) {
        localStorage.removeItem("demo-user")
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, isConfigured: isSupabaseConfigured, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  )
}

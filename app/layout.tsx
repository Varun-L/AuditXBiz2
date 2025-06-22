import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { DemoBanner } from "@/components/demo-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AuditPro - Professional Business Auditing Platform",
  description:
    "Revolutionary transparency platform connecting businesses with independent auditors. Combat fake reviews with verifiable audit reports.",
  keywords: "audit, business, transparency, reviews, verification, professional",
  authors: [{ name: "AuditPro Team" }],
  // viewport: "width=device-width, initial-scale=1",
  // themeColor: "#2563eb",
    generator: 'v0.dev'
}
export const viewport = {
  themeColor: "#2563eb",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DemoBanner />
          <div className="pt-0">{children}</div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

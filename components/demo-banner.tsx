"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Info, RefreshCw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function DemoBanner() {
  const { isDemoMode } = useAuth()

  if (!isDemoMode) return null
  else return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              <span className="font-semibold">Demo Mode Active</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              No data will be saved
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>
      </div>
    </div>
  )
}

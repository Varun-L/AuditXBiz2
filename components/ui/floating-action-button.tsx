"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface FloatingAction {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface FloatingActionButtonProps {
  actions: FloatingAction[]
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Action buttons */}
        <div
          className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-3" style={{ transitionDelay: `${index * 50}ms` }}>
              <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                {action.label}
              </span>
              <Button
                size="sm"
                onClick={action.onClick}
                className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {action.icon}
              </Button>
            </div>
          ))}
        </div>

        {/* Main FAB */}
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
        >
          <div className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
            {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </div>
        </Button>
      </div>
    </div>
  )
}

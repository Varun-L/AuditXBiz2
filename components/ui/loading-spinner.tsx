"use client"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { MapPin, Navigation, Map, CheckCircle } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialLat?: number
  initialLng?: number
  showMap?: boolean
}

export function LocationPicker({ onLocationSelect, initialLat, initialLng, showMap = true }: LocationPickerProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        // Try to get address from coordinates (reverse geocoding)
        try {
          const address = await reverseGeocode(lat, lng)
          const newLocation = { lat, lng, address }
          setLocation(newLocation)
          onLocationSelect(lat, lng, address)

          // Update map if loaded
          if (mapInstance) {
            updateMapLocation(lat, lng)
          }
        } catch (err) {
          const newLocation = { lat, lng }
          setLocation(newLocation)
          onLocationSelect(lat, lng)

          // Update map if loaded
          if (mapInstance) {
            updateMapLocation(lat, lng)
          }
        }

        setLoading(false)
      },
      (error) => {
        setError(`Location access denied: ${error.message}`)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  // Reverse geocoding to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

  // Update map location
  const updateMapLocation = (lat: number, lng: number) => {
    if (mapInstance && mapInstance.marker) {
      mapInstance.map.setView([lat, lng], 15)
      mapInstance.marker.setLatLng([lat, lng])
    }
  }

  // Initialize map (using Leaflet.js)
  useEffect(() => {
    if (showMap && typeof window !== "undefined") {
      loadLeafletMap()
    }
  }, [showMap])

  const loadLeafletMap = async () => {
    try {
      // Dynamically import Leaflet to avoid SSR issues
      const L = await import("leaflet")

      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      const mapContainer = document.getElementById("location-map")
      if (!mapContainer) return

      // Clear any existing map
      mapContainer.innerHTML = ""

      // Default to Mumbai if no initial location
      const defaultLat = initialLat || location?.lat || 19.076
      const defaultLng = initialLng || location?.lng || 72.8777

      const map = L.map("location-map").setView([defaultLat, defaultLng], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map)

      // Store map instance
      setMapInstance({ map, marker })

      // Handle marker drag
      marker.on("dragend", async (e) => {
        const position = e.target.getLatLng()
        const lat = position.lat
        const lng = position.lng

        try {
          const address = await reverseGeocode(lat, lng)
          const newLocation = { lat, lng, address }
          setLocation(newLocation)
          onLocationSelect(lat, lng, address)
        } catch (err) {
          const newLocation = { lat, lng }
          setLocation(newLocation)
          onLocationSelect(lat, lng)
        }
      })

      // Handle map click
      map.on("click", async (e) => {
        const lat = e.latlng.lat
        const lng = e.latlng.lng

        marker.setLatLng([lat, lng])

        try {
          const address = await reverseGeocode(lat, lng)
          const newLocation = { lat, lng, address }
          setLocation(newLocation)
          onLocationSelect(lat, lng, address)
        } catch (err) {
          const newLocation = { lat, lng }
          setLocation(newLocation)
          onLocationSelect(lat, lng)
        }
      })

      setMapLoaded(true)
    } catch (error) {
      console.error("Error loading map:", error)
      setError("Failed to load map. Please try refreshing the page.")
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Select Location
        </CardTitle>
        <CardDescription>
          Choose your location by using GPS, clicking on the map, or dragging the marker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            variant="outline"
            className="flex-1 hover:bg-blue-50 hover:border-blue-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Getting Location...
              </div>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Use Current Location
              </>
            )}
          </Button>
        </div>

        {location && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-900">Location Selected</p>
            </div>
            <p className="text-sm text-green-700">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
            {location.address && <p className="text-sm text-green-700 mt-1">{location.address}</p>}
          </div>
        )}

        {showMap && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Interactive Map</span>
            </div>
            <div
              id="location-map"
              className="w-full h-64 border rounded-lg shadow-sm"
              style={{ minHeight: "256px" }}
            ></div>
            {!mapLoaded && (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mb-2" />
                  <p className="text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500">Click on the map or drag the marker to select a location</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

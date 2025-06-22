"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Truck, Building2, Navigation } from "lucide-react"

interface MapLocation {
  lat: number
  lng: number
  type: "business" | "auditor" | "supplier"
  name: string
  status?: string
  distance?: number
}

interface AssignmentMapProps {
  locations: MapLocation[]
  center?: { lat: number; lng: number }
  zoom?: number
  onLocationSelect?: (location: MapLocation) => void
}

export function AssignmentMap({ locations, center, zoom = 12, onLocationSelect }: AssignmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Default center to Mumbai if not provided
  const defaultCenter = center || { lat: 19.076, lng: 72.8777 }

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && mapRef.current && !mapLoaded) {
      initializeMap()
    }
  }, [mapLoaded, locations])

  // Load Google Maps script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setMapLoaded(true)
      }
      document.head.appendChild(script)
    } else if (window.google) {
      setMapLoaded(true)
    }
  }, [])

  const getMarkerIcon = (type: string, status?: string) => {
    const baseUrl = "https://maps.google.com/mapfiles/ms/icons/"
    switch (type) {
      case "business":
        return baseUrl + "blue-dot.png"
      case "auditor":
        return status === "active" ? baseUrl + "green-dot.png" : baseUrl + "yellow-dot.png"
      case "supplier":
        return baseUrl + "red-dot.png"
      default:
        return baseUrl + "blue-dot.png"
    }
  }

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Add markers for each location
    locations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
          url: getMarkerIcon(location.type, location.status),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      })

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${location.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">
              Type: ${location.type.charAt(0).toUpperCase() + location.type.slice(1)}
            </p>
            ${location.status ? `<p style="margin: 0; font-size: 12px; color: #666;">Status: ${location.status}</p>` : ""}
            ${location.distance ? `<p style="margin: 0; font-size: 12px; color: #666;">Distance: ${location.distance.toFixed(1)}km</p>` : ""}
          </div>
        `,
      })

      marker.addListener("click", () => {
        // Close other info windows
        markersRef.current.forEach((m) => {
          if (m.infoWindow) {
            m.infoWindow.close()
          }
        })

        infoWindow.open(map, marker)
        setSelectedLocation(location)
        onLocationSelect?.(location)
      })

      // Store reference to marker and info window
      marker.infoWindow = infoWindow
      markersRef.current.push(marker)
    })

    // If there are locations, fit bounds to show all markers
    if (locations.length > 1) {
      const bounds = new window.google.maps.LatLngBounds()
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng })
      })
      map.fitBounds(bounds)
    }

    mapInstanceRef.current = map
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "business":
        return <Building2 className="h-4 w-4 text-blue-500" />
      case "auditor":
        return <Users className="h-4 w-4 text-green-500" />
      case "supplier":
        return <Truck className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-500" />
    }
  }

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "business":
        return "bg-blue-100 text-blue-800"
      case "auditor":
        return "bg-green-100 text-green-800"
      case "supplier":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Assignment Map
          </CardTitle>
          <CardDescription>
            Visual representation of businesses, auditors, and suppliers with their locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Map Container */}
          <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-lg border" style={{ minHeight: "400px" }}>
            {!mapLoaded && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Auditors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Suppliers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location List */}
      <Card>
        <CardHeader>
          <CardTitle>Locations ({locations.length})</CardTitle>
          <CardDescription>All mapped locations with details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {locations.map((location, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedLocation === location ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => {
                  setSelectedLocation(location)
                  onLocationSelect?.(location)
                }}
              >
                <div className="flex items-center space-x-3">
                  {getLocationIcon(location.type)}
                  <div>
                    <p className="font-medium">{location.name}</p>
                    <p className="text-sm text-gray-500">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getLocationTypeColor(location.type)}>
                    {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                  </Badge>
                  {location.distance && <Badge variant="outline">{location.distance.toFixed(1)}km</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getLocationIcon(selectedLocation.type)}
              {selectedLocation.name}
            </CardTitle>
            <CardDescription>Selected location details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">
                  {selectedLocation.type.charAt(0).toUpperCase() + selectedLocation.type.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coordinates</p>
                <p className="font-mono text-sm">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
              {selectedLocation.status && (
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedLocation.status}</p>
                </div>
              )}
              {selectedLocation.distance && (
                <div>
                  <p className="text-sm text-gray-500">Distance</p>
                  <p className="font-medium">{selectedLocation.distance.toFixed(1)}km</p>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button size="sm" variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

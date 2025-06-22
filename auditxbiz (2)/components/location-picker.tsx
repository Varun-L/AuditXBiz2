"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search, Target } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void
  initialLat?: number
  initialLng?: number
  initialAddress?: string
}

export function LocationPicker({ onLocationSelect, initialLat, initialLng, initialAddress }: LocationPickerProps) {
  const [coordinates, setCoordinates] = useState({
    lat: initialLat || 19.076,
    lng: initialLng || 72.8777,
  })
  const [address, setAddress] = useState(initialAddress || "")
  const [isLoading, setIsLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Initialize map when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && window.google && mapRef.current && !mapLoaded) {
      initializeMap()
    }
  }, [mapLoaded])

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

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: coordinates.lat, lng: coordinates.lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    const marker = new window.google.maps.Marker({
      position: { lat: coordinates.lat, lng: coordinates.lng },
      map: map,
      draggable: true,
      title: "Drag to select location",
    })

    // Handle marker drag
    marker.addListener("dragend", () => {
      const position = marker.getPosition()
      if (position) {
        const newLat = position.lat()
        const newLng = position.lng()
        setCoordinates({ lat: newLat, lng: newLng })
        reverseGeocode(newLat, newLng)
        onLocationSelect(newLat, newLng)
      }
    })

    // Handle map click
    map.addListener("click", (event: any) => {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      marker.setPosition({ lat, lng })
      setCoordinates({ lat, lng })
      reverseGeocode(lat, lng)
      onLocationSelect(lat, lng)
    })

    mapInstanceRef.current = map
    markerRef.current = marker
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return

    const geocoder = new window.google.maps.Geocoder()
    try {
      const response = await geocoder.geocode({
        location: { lat, lng },
      })

      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address
        setAddress(formattedAddress)
        onLocationSelect(lat, lng, formattedAddress)
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
    }
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCoordinates({ lat, lng })

          // Update map and marker if loaded
          if (mapInstanceRef.current && markerRef.current) {
            const newPosition = { lat, lng }
            mapInstanceRef.current.setCenter(newPosition)
            markerRef.current.setPosition(newPosition)
          }

          reverseGeocode(lat, lng)
          onLocationSelect(lat, lng)
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your current location. Please select manually on the map.")
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
      setIsLoading(false)
    }
  }

  const searchLocation = async (searchQuery: string) => {
    if (!window.google || !searchQuery.trim()) return

    const geocoder = new window.google.maps.Geocoder()
    try {
      const response = await geocoder.geocode({
        address: searchQuery,
      })

      if (response.results[0]) {
        const location = response.results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()
        const formattedAddress = response.results[0].formatted_address

        setCoordinates({ lat, lng })
        setAddress(formattedAddress)

        // Update map and marker if loaded
        if (mapInstanceRef.current && markerRef.current) {
          const newPosition = { lat, lng }
          mapInstanceRef.current.setCenter(newPosition)
          markerRef.current.setPosition(newPosition)
        }

        onLocationSelect(lat, lng, formattedAddress)
      }
    } catch (error) {
      console.error("Geocoding failed:", error)
      alert("Location not found. Please try a different search term.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Selection
        </CardTitle>
        <CardDescription>
          Select your exact location by dropping a pin on the map or using your current location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for an address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  searchLocation(address)
                }
              }}
            />
          </div>
          <Button variant="outline" onClick={() => searchLocation(address)} disabled={!address.trim()}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" onClick={getCurrentLocation} disabled={isLoading}>
            <Target className="h-4 w-4 mr-2" />
            {isLoading ? "Getting..." : "Current Location"}
          </Button>
        </div>

        {/* Map Container */}
        <div className="space-y-2">
          <div ref={mapRef} className="w-full h-64 bg-gray-100 rounded-lg border" style={{ minHeight: "300px" }}>
            {!mapLoaded && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Click on the map or drag the marker to select your exact location</p>
        </div>

        {/* Coordinate Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              value={coordinates.lat.toFixed(6)}
              onChange={(e) => {
                const lat = Number.parseFloat(e.target.value) || 0
                setCoordinates((prev) => ({ ...prev, lat }))
                onLocationSelect(lat, coordinates.lng)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              value={coordinates.lng.toFixed(6)}
              onChange={(e) => {
                const lng = Number.parseFloat(e.target.value) || 0
                setCoordinates((prev) => ({ ...prev, lng }))
                onLocationSelect(coordinates.lat, lng)
              }}
            />
          </div>
        </div>

        {/* Selected Address Display */}
        {address && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Selected Location:</p>
            <p className="text-sm text-blue-700">{address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

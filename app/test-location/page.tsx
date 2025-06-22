"use client"

import { useState } from "react"
import { LocationPicker } from "@/components/location-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/ui/fade-in"
import { MapPin, ArrowLeft, Globe, Navigation, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TestLocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address?: string
  } | null>(null)

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng, address })
    console.log("Location selected:", { lat, lng, address })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Location Picker Test
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Test the location picker component with GPS detection, interactive map, and reverse geocoding
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Picker */}
          <FadeIn delay={200}>
            <LocationPicker onLocationSelect={handleLocationSelect} showMap={true} />
          </FadeIn>

          {/* Results Display */}
          <div className="space-y-6">
            <FadeIn delay={300}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Location Test Results
                  </CardTitle>
                  <CardDescription>Real-time location data and PostGIS integration examples</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedLocation ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-700">
                          Location Selected
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Navigation className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-900">Coordinates</p>
                          </div>
                          <p className="text-sm text-blue-700">Latitude: {selectedLocation.lat.toFixed(6)}</p>
                          <p className="text-sm text-blue-700">Longitude: {selectedLocation.lng.toFixed(6)}</p>
                        </div>

                        {selectedLocation.address && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="h-4 w-4 text-green-600" />
                              <p className="text-sm font-medium text-green-900">Reverse Geocoded Address</p>
                            </div>
                            <p className="text-sm text-green-700">{selectedLocation.address}</p>
                          </div>
                        )}

                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4 text-purple-600" />
                            <p className="text-sm font-medium text-purple-900">PostGIS Format</p>
                          </div>
                          <code className="text-xs text-purple-600 block">
                            ST_MakePoint({selectedLocation.lng}, {selectedLocation.lat})
                          </code>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="h-4 w-4 text-orange-600" />
                            <p className="text-sm font-medium text-orange-900">Distance Query Example</p>
                          </div>
                          <code className="text-xs text-orange-600 block whitespace-pre-wrap">
                            {`SELECT *, 
  ST_Distance(
    location, 
    ST_MakePoint(${selectedLocation.lng}, ${selectedLocation.lat})::geography
  ) AS distance_meters
FROM businesses
ORDER BY location <-> ST_MakePoint(${selectedLocation.lng}, ${selectedLocation.lat})::geography
LIMIT 5;`}
                          </code>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No location selected yet</p>
                      <p className="text-sm text-gray-400 mt-2">Use the location picker to select a location</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={400}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                  <CardDescription>Test all location picker features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">GPS Location</p>
                      <p className="text-sm text-gray-600">Click "Use Current Location" to get your GPS coordinates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Map Interaction</p>
                      <p className="text-sm text-gray-600">Click anywhere on the map to select that location</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Drag Marker</p>
                      <p className="text-sm text-gray-600">Drag the red marker to fine-tune the location</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-blue-600">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Address Lookup</p>
                      <p className="text-sm text-gray-600">Automatic reverse geocoding provides readable addresses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={500}>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Integration Features</CardTitle>
                  <CardDescription>Ready for production use</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ✓ GPS Detection
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ✓ Interactive Map
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ✓ Reverse Geocoding
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ✓ PostGIS Ready
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ✓ Mobile Responsive
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

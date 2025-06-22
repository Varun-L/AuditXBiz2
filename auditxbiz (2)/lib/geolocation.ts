import { supabase } from "../supabase-client"

export interface LocationAssignment {
  business_id: string
  business_name: string
  business_location: { lat: number; lng: number }
  auditor_id?: string
  auditor_name?: string
  auditor_location?: { lat: number; lng: number }
  supplier_id?: string
  supplier_name?: string
  supplier_location?: { lat: number; lng: number }
  auditor_distance?: number
  supplier_distance?: number
  assigned_at: string
  status: string
}

export async function getRecentAssignments(): Promise<LocationAssignment[]> {
  const { data, error } = await supabase
    .from("audit_tasks")
    .select(`
      id,
      business_id,
      auditor_id,
      assignment_distance_meters,
      assigned_at,
      status,
      businesses (
        name,
        location,
        address
      ),
      users!auditor_id (
        full_name,
        location
      )
    `)
    .not("auditor_id", "is", null)
    .order("assigned_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching recent assignments:", error)
    throw error
  }

  // Transform the data to match our interface
  return (data || []).map((item: any) => ({
    business_id: item.business_id,
    business_name: item.businesses?.name || "Unknown",
    business_location: parseLocation(item.businesses?.location),
    auditor_id: item.auditor_id,
    auditor_name: item.users?.full_name || "Unknown",
    auditor_location: parseLocation(item.users?.location),
    auditor_distance: item.assignment_distance_meters ? item.assignment_distance_meters / 1000 : 0,
    assigned_at: item.assigned_at,
    status: item.status,
  }))
}

export async function getAuditorsInRadius(lat: number, lng: number, radiusKm = 10): Promise<any[]> {
  const { data, error } = await supabase.rpc("get_auditors_within_radius", {
    business_location: `POINT(${lng} ${lat})`,
    radius_meters: radiusKm * 1000,
  })

  if (error) {
    console.error("Error fetching auditors in radius:", error)
    throw error
  }

  return data || []
}

export async function getSuppliersInRadius(lat: number, lng: number, radiusKm = 10): Promise<any[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "supplier")
    .eq("is_active", true)
    .eq("is_frozen", false)

  if (error) {
    console.error("Error fetching suppliers:", error)
    throw error
  }

  // Filter by distance (simplified - in production, use PostGIS function)
  return (data || []).filter((supplier) => {
    if (!supplier.location) return false
    const supplierLocation = parseLocation(supplier.location)
    const distance = calculateDistance(lat, lng, supplierLocation.lat, supplierLocation.lng)
    return distance <= radiusKm
  })
}

// Helper function to parse PostGIS POINT format
function parseLocation(locationString: string): { lat: number; lng: number } {
  if (!locationString) return { lat: 0, lng: 0 }

  // Handle different PostGIS formats
  const match = locationString.match(/POINT$$([^)]+)$$/) || locationString.match(/([0-9.-]+)\s+([0-9.-]+)/)

  if (match) {
    const coords = match[1] ? match[1].split(" ") : [match[1], match[2]]
    return {
      lng: Number.parseFloat(coords[0]),
      lat: Number.parseFloat(coords[1]),
    }
  }

  return { lat: 0, lng: 0 }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

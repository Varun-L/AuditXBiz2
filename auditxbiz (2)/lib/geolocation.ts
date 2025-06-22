// Utility functions for geolocation calculations and PostGIS integration

export interface Coordinates {
  lat: number
  lng: number
}

export interface LocationEntity {
  id: string
  name: string
  location: Coordinates
  type: "business" | "auditor" | "supplier"
  status?: string
}

export interface AssignmentResult {
  auditor: {
    id: string
    name: string
    distance: number
  }
  supplier: {
    id: string
    name: string
    distance: number
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat)
  const dLng = toRadians(coord2.lng - coord1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Find nearest entities within a given radius
 */
export function findNearestEntities(
  center: Coordinates,
  entities: LocationEntity[],
  maxDistance = 50, // km
): LocationEntity[] {
  return entities
    .map((entity) => ({
      ...entity,
      distance: calculateDistance(center, entity.location),
    }))
    .filter((entity) => entity.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Generate PostGIS query for finding nearest auditor
 */
export function generateNearestAuditorQuery(lat: number, lng: number, limit = 1): string {
  return `
    SELECT 
      u.id,
      u.full_name,
      u.phone,
      u.completion_rate,
      ST_Distance(ST_MakePoint(${lng}, ${lat}), u.location) as distance_meters
    FROM users u
    WHERE u.role = 'auditor' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    AND u.is_frozen = false
    ORDER BY ST_MakePoint(${lng}, ${lat}) <-> u.location
    LIMIT ${limit};
  `
}

/**
 * Generate PostGIS query for finding nearest supplier
 */
export function generateNearestSupplierQuery(lat: number, lng: number, limit = 1): string {
  return `
    SELECT 
      u.id,
      u.full_name,
      u.phone,
      ST_Distance(ST_MakePoint(${lng}, ${lat}), u.location) as distance_meters
    FROM users u
    WHERE u.role = 'supplier' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    AND u.is_frozen = false
    ORDER BY ST_MakePoint(${lng}, ${lat}) <-> u.location
    LIMIT ${limit};
  `
}

/**
 * Generate PostGIS query for entities within radius
 */
export function generateWithinRadiusQuery(
  lat: number,
  lng: number,
  radiusMeters: number,
  entityType: "auditor" | "supplier",
): string {
  return `
    SELECT 
      u.id,
      u.full_name,
      u.phone,
      u.completion_rate,
      ST_Distance(ST_MakePoint(${lng}, ${lat}), u.location) as distance_meters,
      ST_X(u.location) as longitude,
      ST_Y(u.location) as latitude
    FROM users u
    WHERE u.role = '${entityType}' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    AND u.is_frozen = false
    AND ST_DWithin(ST_MakePoint(${lng}, ${lat}), u.location, ${radiusMeters})
    ORDER BY ST_MakePoint(${lng}, ${lat}) <-> u.location;
  `
}

/**
 * Validate coordinates
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !isNaN(lat) && !isNaN(lng)
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

/**
 * Get center point of multiple coordinates
 */
export function getCenterPoint(coordinates: Coordinates[]): Coordinates {
  if (coordinates.length === 0) {
    return { lat: 19.076, lng: 72.8777 } // Default to Mumbai
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 },
  )

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length,
  }
}

/**
 * Generate bounds for map display
 */
export function getBounds(coordinates: Coordinates[]): {
  north: number
  south: number
  east: number
  west: number
} {
  if (coordinates.length === 0) {
    return { north: 19.1, south: 19.0, east: 72.9, west: 72.8 }
  }

  const lats = coordinates.map((c) => c.lat)
  const lngs = coordinates.map((c) => c.lng)

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  }
}

/**
 * Mangalore Spatial Grid & Geometry Engine
 * Grounded in Mangalore's coastal, river bridge, and hilly topography
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

export const MANGALORE_DEPOT: Coordinate & { name: string } = {
  name: 'Hampankatta Central Logistics Hub',
  lat: 12.8698,
  lng: 74.8426
};

// Calculate Haversine direct distance in kilometers
export function calculateHaversineDistanceKm(p1: Coordinate, p2: Coordinate): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Estimates road driving distance accounting for urban road circuity (circuity factor ~ 1.32 in Indian cities)
export function estimateRoadDistanceKm(p1: Coordinate, p2: Coordinate): number {
  const directKm = calculateHaversineDistanceKm(p1, p2);
  // If points are identical, 0 km
  if (directKm < 0.05) return 0.1;
  return Number((directKm * 1.32).toFixed(2));
}

// Estimates driving time in minutes based on vehicle speed profile and traffic density
export function estimateTravelTimeMins(distanceKm: number, vehicleSpeedKmh: number = 25, congestionMultiplier: number = 1.0): number {
  const effectiveSpeed = Math.max(8, vehicleSpeedKmh / congestionMultiplier);
  const hours = distanceKm / effectiveSpeed;
  return Math.max(2, Math.round(hours * 60));
}

// Generate realistic polyline coordinates connecting two points with smooth road bends
export function interpolateRoadCoordinates(from: Coordinate, to: Coordinate, steps: number = 8): [number, number][] {
  const coords: [number, number][] = [];
  
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps;
    // Add small realistic sinusoidal curvature resembling Mangalore arterial roads
    const arcOffset = Math.sin(fraction * Math.PI) * 0.0025;
    const lat = from.lat + (to.lat - from.lat) * fraction + arcOffset;
    const lng = from.lng + (to.lng - from.lng) * fraction + (arcOffset * 0.5);
    coords.push([Number(lng.toFixed(6)), Number(lat.toFixed(6))]); // [lng, lat] for Mapbox
  }

  return coords;
}

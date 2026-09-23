import { Coordinate, estimateRoadDistanceKm } from './mangalore-grid.js';
import { NavigationStep } from '../types/index.js';

// Calculate compass bearing between two coordinates
export function calculateBearing(start: Coordinate, end: Coordinate): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Generate turn-by-turn navigation instructions for a route leg
export function generateLegNavigationSteps(
  from: Coordinate,
  to: Coordinate,
  destinationName: string,
  sector: string
): NavigationStep[] {
  const totalDistanceKm = estimateRoadDistanceKm(from, to);
  const totalMeters = Math.round(totalDistanceKm * 1000);
  const bearing = calculateBearing(from, to);

  const steps: NavigationStep[] = [];

  // Step 1: Initial departure maneuver
  const departDistance = Math.min(250, Math.round(totalMeters * 0.25));
  steps.push({
    instruction: `Depart towards ${sector} corridor`,
    distance_meters: departDistance,
    duration_seconds: Math.round(departDistance / 7),
    maneuver_type: 'keep-straight',
    street_name: 'Hub Access Road'
  });

  // Step 2: Main intermediate turn or roundabout
  const midDistance = Math.max(100, totalMeters - departDistance - 150);
  let midManeuver: NavigationStep['maneuver_type'] = 'keep-straight';
  let turnInstruction = `Continue straight along ${sector} arterial`;

  if (bearing >= 45 && bearing < 135) {
    midManeuver = 'turn-right';
    turnInstruction = `In ${departDistance}m, turn right onto ${getStreetNameForSector(sector)}`;
  } else if (bearing >= 225 && bearing < 315) {
    midManeuver = 'turn-left';
    turnInstruction = `In ${departDistance}m, turn left onto ${getStreetNameForSector(sector)}`;
  } else if (bearing >= 135 && bearing < 225) {
    midManeuver = 'roundabout';
    turnInstruction = `Take the 2nd exit at the junction towards ${sector}`;
  }

  steps.push({
    instruction: turnInstruction,
    distance_meters: midDistance,
    duration_seconds: Math.round(midDistance / 8),
    maneuver_type: midManeuver,
    street_name: getStreetNameForSector(sector)
  });

  // Step 3: Destination arrival
  steps.push({
    instruction: `Arrive at destination: ${destinationName}`,
    distance_meters: 50,
    duration_seconds: 15,
    maneuver_type: 'destination-arrival',
    street_name: destinationName
  });

  return steps;
}

function getStreetNameForSector(sector: string): string {
  const mapping: Record<string, string> = {
    Hampankatta: 'K.S. Rao Road',
    Falnir: 'Mother Theresa Road, Falnir',
    Bunder: 'Old Port Road, Bunder',
    CarStreet: 'Temple Square Alley',
    Jyothi: 'KMC Light House Hill Road',
    Kadri: 'Kadri Temple Road',
    Mallikatta: 'Mallikatta Circle',
    Kankanady: 'Father Muller Hospital Bypass',
    Bejai: 'Bejai Main Road',
    Derebail: 'Konchady Ridge Road',
    Kulur: 'NH66 Gurupura River Bridge',
    Panambur: 'Panambur Harbour Road',
    Baikampady: 'Baikampady Industrial Expressway',
    Surathkal: 'NH66 Highway Corridor'
  };

  return mapping[sector] || 'Mangalore City Road';
}

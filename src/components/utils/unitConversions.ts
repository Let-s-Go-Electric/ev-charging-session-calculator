// Unit conversion utilities

export type DistanceUnit = "miles" | "km";

const MILES_TO_KM = 1.60934;
const KM_TO_MILES = 1 / MILES_TO_KM;

/**
 * Convert distance from miles to the target unit
 */
export function convertDistance(miles: number, targetUnit: DistanceUnit): number {
  if (targetUnit === "km") {
    return miles * MILES_TO_KM;
  }
  return miles;
}

/**
 * Convert distance from any unit to miles (base unit)
 */
export function convertToMiles(value: number, fromUnit: DistanceUnit): number {
  if (fromUnit === "km") {
    return value * KM_TO_MILES;
  }
  return value;
}

/**
 * Get the distance unit abbreviation for display
 */
export function getDistanceUnitLabel(unit: DistanceUnit): string {
  return unit === "km" ? "km" : "mi";
}

/**
 * Get the full distance unit name
 */
export function getDistanceUnitName(unit: DistanceUnit): string {
  return unit === "km" ? "Kilometers" : "Miles";
}
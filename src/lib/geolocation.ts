import { calculateDistance, formatDistance } from "./distance";

// Default coordinates: Patia / KIIT Square, Bhubaneswar
export const DEFAULT_BHUBANESWAR_LOCATION = {
  latitude: 20.3533,
  longitude: 85.8195,
  name: "Patia, Bhubaneswar",
};

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  isDefault?: boolean;
}

/**
 * Get current user coordinates using Capacitor Geolocation (Native) or Web Geolocation API
 */
export async function getCurrentCoordinates(): Promise<UserCoordinates> {
  // 1. Try Capacitor Geolocation if on native platform
  try {
    const { Geolocation } = await import("@capacitor/geolocation");
    if (Geolocation) {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== "granted") {
        const req = await Geolocation.requestPermissions();
        if (req.location !== "granted") {
          return { ...DEFAULT_BHUBANESWAR_LOCATION, isDefault: true };
        }
      }
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        isDefault: false,
      };
    }
  } catch {
    // Fall back to browser geolocation
  }

  // 2. Try Web Navigator Geolocation
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 6000,
          maximumAge: 60000,
        });
      });
      return {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        isDefault: false,
      };
    } catch {
      // Permission denied or timed out
    }
  }

  // 3. Fallback to Patia cluster
  return { ...DEFAULT_BHUBANESWAR_LOCATION, isDefault: true };
}

/**
 * Compute distance from user's current coordinates to a salon coordinate
 */
export function getDistanceToSalon(
  userCoords: UserCoordinates | null,
  salonLat?: number,
  salonLon?: number
): string {
  const uLat = userCoords?.latitude ?? DEFAULT_BHUBANESWAR_LOCATION.latitude;
  const uLon = userCoords?.longitude ?? DEFAULT_BHUBANESWAR_LOCATION.longitude;

  if (!salonLat || !salonLon) {
    return "1.2 km";
  }

  const distKm = calculateDistance(uLat, uLon, salonLat, salonLon);
  return formatDistance(distKm);
}

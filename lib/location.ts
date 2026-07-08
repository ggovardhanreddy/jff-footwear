import { SHIPPING_CONFIG } from "@/config/shipping";
import type { GeolocationAddress } from "@/types";

interface NominatimAddress {
  postcode?: string;
  state?: string;
  country?: string;
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
  county?: string;
  state_district?: string;
  road?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

/** Reverse geocode coordinates via OpenStreetMap Nominatim (free, no API key) */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeolocationAddress> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
    addressdetails: "1",
  });

  const response = await fetch(
    `${SHIPPING_CONFIG.location.nominatimUrl}?${params}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": SHIPPING_CONFIG.location.userAgent,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch address from your location.");
  }

  const data = (await response.json()) as NominatimResponse;
  const addr = data.address;

  if (!addr) {
    throw new Error("No address found for this location.");
  }

  const pincode = (addr.postcode || "").replace(/\D/g, "").slice(0, 6);
  const city =
    addr.city || addr.town || addr.village || addr.county || "";
  const area =
    addr.suburb || addr.neighbourhood || addr.road || "";
  const district = addr.state_district || addr.county || "";
  const state = addr.state || "";
  const country = addr.country || "India";

  return {
    area,
    city,
    district,
    state,
    pincode,
    country,
  };
}

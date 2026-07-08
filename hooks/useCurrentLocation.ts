"use client";

import { useCallback, useState } from "react";
import { reverseGeocode } from "@/lib/location";
import type { GeolocationAddress } from "@/types";

export type LocationStatus =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "error";

export function useCurrentLocation() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState("");

  const requestLocation = useCallback(async (): Promise<GeolocationAddress | null> => {
    setError("");

    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported on this device.");
      return null;
    }

    if (!navigator.onLine) {
      setStatus("error");
      setError("You are offline. Please enter your address manually.");
      return null;
    }

    setStatus("loading");

    return new Promise((resolve) => {
      const timeoutId = window.setTimeout(() => {
        setStatus("error");
        setError("Location request timed out. Please try again or enter manually.");
        resolve(null);
      }, 16000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          window.clearTimeout(timeoutId);
          try {
            const address = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );
            setStatus("success");
            resolve({ ...address, country: address.country || "India" });
          } catch (err) {
            setStatus("error");
            setError(
              err instanceof Error
                ? err.message
                : "Unable to resolve your location. Please enter manually."
            );
            resolve(null);
          }
        },
        (geoError) => {
          window.clearTimeout(timeoutId);
          if (geoError.code === geoError.PERMISSION_DENIED) {
            setStatus("denied");
            setError(
              "Location permission denied. Please enable location access or enter your address manually."
            );
          } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
            setStatus("error");
            setError("Location unavailable. Please enter your address manually.");
          } else {
            setStatus("error");
            setError("Unable to get your location. Please try again.");
          }
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    });
  }, []);

  return { status, error, requestLocation, isLoading: status === "loading" };
}

"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { readStoredLocation, useAuth } from "@/context/AuthContext";

type LocationContextValue = {
  location: string;
  pincode: string;
  detecting: boolean;
  setLocation: (location: string, pincode?: string) => Promise<void>;
  detectLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { profile, updateDeliveryLocation } = useAuth();
  const [location, setLocationState] = useState("Rayachoty, AP");
  const [pincode, setPincode] = useState("516269");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (profile?.delivery_location) {
      setLocationState(profile.delivery_location);
      setPincode(profile.delivery_pincode || "");
      return;
    }
    const stored = readStoredLocation();
    setLocationState(stored.location);
    setPincode(stored.pincode);
  }, [profile?.delivery_location, profile?.delivery_pincode]);

  const setLocation = useCallback(
    async (next: string, nextPincode = "") => {
      setLocationState(next);
      setPincode(nextPincode);
      await updateDeliveryLocation(next, nextPincode);
    },
    [updateDeliveryLocation]
  );

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000,
        });
      });
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { headers: { Accept: "application/json" } }
      );
      if (res.ok) {
        const data = await res.json();
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state_district ||
          "Your area";
        const state = data.address?.state || "";
        const pin = data.address?.postcode || "";
        await setLocation(`${city}${state ? `, ${state}` : ""}`, pin);
      } else {
        await setLocation("Near you", "");
      }
    } catch {
      /* keep existing */
    } finally {
      setDetecting(false);
    }
  }, [setLocation]);

  useEffect(() => {
    const stored = readStoredLocation();
    if (stored.location === "Rayachoty, AP") {
      void detectLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider value={{ location, pincode, detecting, setLocation, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}

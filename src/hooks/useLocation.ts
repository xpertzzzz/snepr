import { useState, useEffect } from "react";
import {
  LocationState,
  DEFAULT_LOCATION,
  BHUBANESWAR_AREAS,
  LAUNCH_CITY,
  Area,
} from "@/types/location";

const STORAGE_KEY = "snepr_user_locality";
const HAS_SELECTED_KEY = "snepr_has_selected_locality";

export function useLocation() {
  const [location, setLocation] = useState<LocationState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.areaName) {
            return parsed;
          }
        } catch {}
      }
    }
    return DEFAULT_LOCATION;
  });

  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem(HAS_SELECTED_KEY);
    }
    return false;
  });

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const saveLocality = (area: Area) => {
    const newState: LocationState = {
      cityId: LAUNCH_CITY.id,
      cityName: LAUNCH_CITY.name,
      citySlug: LAUNCH_CITY.slug,
      areaId: area.id,
      areaName: area.name,
      areaSlug: area.slug,
      formattedLabel: `${area.name}, ${LAUNCH_CITY.name}`,
      locality: area.name,
      city: LAUNCH_CITY.name,
    };
    setLocation(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      localStorage.setItem(HAS_SELECTED_KEY, "true");
    }
    setIsFirstVisit(false);
  };

  const selectAreaById = (areaId: number) => {
    const area = BHUBANESWAR_AREAS.find((a) => a.id === areaId) || BHUBANESWAR_AREAS[0];
    saveLocality(area);
  };

  const selectAreaBySlug = (slug: string) => {
    const area =
      BHUBANESWAR_AREAS.find((a) => a.slug.toLowerCase() === slug.toLowerCase()) ||
      BHUBANESWAR_AREAS[0];
    saveLocality(area);
  };

  // Backwards compatibility for previous callers
  const setManualLocation = (label: string) => {
    const matched = BHUBANESWAR_AREAS.find((a) =>
      label.toLowerCase().includes(a.name.toLowerCase())
    );
    if (matched) {
      saveLocality(matched);
    } else {
      selectAreaById(1);
    }
  };

  const requestGpsLocation = () => {
    // Zero GPS popups - open locality picker instead
    setIsSelectorOpen(true);
  };

  return {
    location,
    areas: BHUBANESWAR_AREAS,
    city: LAUNCH_CITY,
    isFirstVisit,
    isSelectorOpen,
    setIsSelectorOpen,
    selectAreaById,
    selectAreaBySlug,
    setLocality: saveLocality,
    setManualLocation,
    requestGpsLocation,
    loading: false,
    error: null,
  };
}

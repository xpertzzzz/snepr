// Unified Locality Architecture for Snepr (Bhubaneswar Launch)
// Zero GPS detection, zero location permissions, pure locality-based discovery

export interface City {
  id: number;
  name: string;
  state: string;
  slug: string;
  isActive: boolean;
}

export interface Area {
  id: number;
  cityId: number;
  name: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
}

export interface LocationState {
  cityId: number;
  cityName: string;
  citySlug: string;
  areaId: number;
  areaName: string;
  areaSlug: string;
  formattedLabel: string;
  // Backward compatibility alias for legacy components
  locality: string;
  city: string;
}

export const LAUNCH_CITY: City = {
  id: 1,
  name: "Bhubaneswar",
  state: "Odisha",
  slug: "bhubaneswar",
  isActive: true,
};

export const BHUBANESWAR_AREAS: Area[] = [
  { id: 1, cityId: 1, name: "Patia", slug: "patia", isActive: true, displayOrder: 1 },
  { id: 2, cityId: 1, name: "KIIT Road", slug: "kiit-road", isActive: true, displayOrder: 2 },
  { id: 3, cityId: 1, name: "Saheed Nagar", slug: "saheed-nagar", isActive: true, displayOrder: 3 },
  { id: 4, cityId: 1, name: "Jaydev Vihar", slug: "jaydev-vihar", isActive: true, displayOrder: 4 },
  { id: 5, cityId: 1, name: "Chandrasekharpur", slug: "chandrasekharpur", isActive: true, displayOrder: 5 },
  { id: 6, cityId: 1, name: "Rasulgarh", slug: "rasulgarh", isActive: true, displayOrder: 6 },
  { id: 7, cityId: 1, name: "Nayapalli", slug: "nayapalli", isActive: true, displayOrder: 7 },
  { id: 8, cityId: 1, name: "Khandagiri", slug: "khandagiri", isActive: true, displayOrder: 8 },
];

export const DEFAULT_LOCATION: LocationState = {
  cityId: 1,
  cityName: "Bhubaneswar",
  citySlug: "bhubaneswar",
  areaId: 1,
  areaName: "Patia",
  areaSlug: "patia",
  formattedLabel: "Patia, Bhubaneswar",
  locality: "Patia",
  city: "Bhubaneswar",
};

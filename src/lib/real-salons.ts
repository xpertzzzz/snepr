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
  salonCount?: number;
}

export interface Chair {
  id: number;
  salonId: number;
  chairNumber: number;
  name: string;
  barberName: string;
  status: "available" | "occupied" | "finishing" | "break" | "offline" | "maintenance";
  currentService?: string;
  currentToken?: string;
  serviceMinutesLeft?: number;
}

export interface RealSalon {
  id: number;
  name: string;
  slug: string;
  rating: string;
  reviewCount: number;
  category: string;
  cityId: number;
  cityName: string;
  citySlug: string;
  areaId: number;
  areaName: string;
  areaSlug: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  imageUrl?: string;
  verificationStatus: "verified" | "unverified";
  operationalStatus: "active" | "inactive" | "paused";
  queueStatus: "available" | "finishing" | "busy";
  waitTime: number;
  waitingCount: number;
  totalChairs: number;
  availableChairs: number;
  chairs: Chair[];
  services: Array<{ id: number; name: string; price: number; durationMins: number; discountPercent?: number }>;
  barbers: Array<{ id: number; name: string; role: string; specialty: string; rating: string; reviewCount: number; isAvailable: boolean }>;
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
  description?: string;
}

export const CITIES: City[] = [
  { id: 1, name: "Bhubaneswar", state: "Odisha", slug: "bhubaneswar", isActive: true },
];

export const BHUBANESWAR_AREAS: Area[] = [
  { id: 1, cityId: 1, name: "Patia & KIIT Square", slug: "patia", isActive: true, displayOrder: 1 },
  { id: 2, cityId: 1, name: "Chandrasekharpur & Niladri Vihar", slug: "chandrasekharpur", isActive: true, displayOrder: 2 },
  { id: 3, cityId: 1, name: "Jayadev Vihar", slug: "jayadev-vihar", isActive: true, displayOrder: 3 },
  { id: 4, cityId: 1, name: "Gajapati Nagar", slug: "gajapati-nagar", isActive: true, displayOrder: 4 },
  { id: 5, cityId: 1, name: "Saheed Nagar", slug: "saheed-nagar", isActive: true, displayOrder: 5 },
  { id: 6, cityId: 1, name: "Nayapalli", slug: "nayapalli", isActive: true, displayOrder: 6 },
  { id: 7, cityId: 1, name: "Rasulgarh", slug: "rasulgarh", isActive: true, displayOrder: 7 },
  { id: 8, cityId: 1, name: "Khandagiri", slug: "khandagiri", isActive: true, displayOrder: 8 },
];

export const DEFAULT_SERVICES = [
  { id: 1, name: "Signature Haircut & Style", price: 20000, durationMins: 30, discountPercent: 0 },
  { id: 2, name: "Beard Sculpt & Razor Shape", price: 12000, durationMins: 15, discountPercent: 0 },
  { id: 3, name: "Hair Wash & Deep Conditioning", price: 15000, durationMins: 20, discountPercent: 0 },
  { id: 4, name: "Charcoal Face Clean-up", price: 35000, durationMins: 30, discountPercent: 10 },
  { id: 5, name: "Deep Nourishing Hair Spa", price: 65000, durationMins: 45, discountPercent: 15 },
];

export const DEFAULT_BARBERS = [
  { id: 1, name: "Sameer Mohanty", role: "Master Stylist", specialty: "Fade, Texture Crop & Beard Sculpt", rating: "4.9", reviewCount: 84, isAvailable: true },
  { id: 2, name: "Rahul Sen", role: "Senior Stylist", specialty: "Classic Scissor Cuts & Hair Spa", rating: "4.8", reviewCount: 62, isAvailable: true },
  { id: 3, name: "Sunita Jena", role: "Beauty & Color Specialist", specialty: "Hair Color, Skin & Bridal", rating: "4.9", reviewCount: 78, isAvailable: true },
];

// ─── SNEPR AUTHORITATIVE BHUBANESWAR SALON DATABASE (13 VERIFIED LEADS) ───
export const REAL_SALONS_DATA: RealSalon[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. PATIA & KIIT SQUARE (Priority Area 1)
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Lakmé Salon | For Him and Her",
    slug: "lakme-salon-patia",
    rating: "4.8",
    reviewCount: 2554,
    category: "Hair Styling, Skin & Grooming",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "1st Floor, Khata No. 474/156, Plot No. 435/1866, KIIT Road, opposite Manyavar, Patia, Bhubaneswar – 751024",
    phone: "+91 92373 62221",
    email: "lakmesalonindia1@gmail.com",
    hours: "10:00 AM – 8:30 PM",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 4,
    availableChairs: 2,
    chairs: [
      { id: 101, salonId: 1, chairNumber: 1, name: "Station 1", barberName: "Priyanka Sahoo", status: "available" },
      { id: 102, salonId: 1, chairNumber: 2, name: "Station 2", barberName: "Rakesh Nayak", status: "occupied", currentService: "Haircut & Wash", currentToken: "#A-102", serviceMinutesLeft: 12 },
      { id: 103, salonId: 1, chairNumber: 3, name: "Station 3", barberName: "Sunita Jena", status: "available" },
      { id: 104, salonId: 1, chairNumber: 4, name: "Station 4", barberName: "Deepak Dash", status: "finishing", currentService: "Hair Spa", currentToken: "#A-103", serviceMinutesLeft: 4 },
    ],
    services: [
      { id: 11, name: "Signature Haircut & Styling", price: 35000, durationMins: 35 },
      { id: 12, name: "Men's Beard Sculpt & Shave", price: 18000, durationMins: 20 },
      { id: 13, name: "Lakmé Radiance Skin Treatment", price: 75000, durationMins: 45 },
      { id: 14, name: "Bridal & Party Make-up Consultation", price: 150000, durationMins: 60 },
    ],
    barbers: [
      { id: 101, name: "Priyanka Sahoo", role: "Creative Director", specialty: "Hair Styling & Color", rating: "4.9", reviewCount: 142, isAvailable: true },
      { id: 102, name: "Rakesh Nayak", role: "Master Groomer", specialty: "Men's Precision Fades & Beards", rating: "4.8", reviewCount: 98, isAvailable: true },
      { id: 103, name: "Sunita Jena", role: "Skin & Makeup Artist", specialty: "Skin Radiance & Bridal", rating: "4.9", reviewCount: 110, isAvailable: true },
    ],
  },
  {
    id: 2,
    name: "NVN Unisex Salon",
    slug: "nvn-unisex-salon-patia",
    rating: "4.9",
    reviewCount: 284,
    category: "Hair, Skin, Nails & Bridal",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "Plot No. 386, 1st Floor, Patia Square, Nandankanan Road, near Union Bank, Bhubaneswar – 751024",
    phone: "+91 93373 21880",
    website: "https://nvnsalon.com",
    hours: "9:30 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 5,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 201, salonId: 2, chairNumber: 1, name: "Styling Station 1", barberName: "Nabin Mohanty", status: "available" },
      { id: 202, salonId: 2, chairNumber: 2, name: "Styling Station 2", barberName: "Anil Sahu", status: "occupied", currentService: "Fade & Beard Sculpt", currentToken: "#N-14", serviceMinutesLeft: 5 },
      { id: 203, salonId: 2, chairNumber: 3, name: "Nail & Skin Bay", barberName: "Pooja Ray", status: "break" },
    ],
    services: [
      { id: 21, name: "Classic Scissor Cut & Finish", price: 25000, durationMins: 30 },
      { id: 22, name: "Beard Shaping & Lineup", price: 12000, durationMins: 15 },
      { id: 23, name: "Gel Nail Art & Polish", price: 45000, durationMins: 40 },
      { id: 24, name: "De-Tan Facial Clean-up", price: 40000, durationMins: 30 },
    ],
    barbers: [
      { id: 201, name: "Nabin Mohanty", role: "Head Barber", specialty: "Modern Layers & Fades", rating: "4.9", reviewCount: 88, isAvailable: true },
      { id: 202, name: "Anil Sahu", role: "Senior Stylist", specialty: "Classic Haircuts & Beard Trim", rating: "4.8", reviewCount: 64, isAvailable: true },
    ],
  },
  {
    id: 3,
    name: "Green Trends Unisex Salon | Patia",
    slug: "green-trends-patia",
    rating: "4.7",
    reviewCount: 4887,
    category: "Unisex Hair & Beauty",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "1st Floor, D1 Square, Nandankanan Road, above Utkal Hyundai Showroom, Patia, Bhubaneswar – 751024",
    phone: "+91 98610 77886",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 4,
    availableChairs: 2,
    chairs: [
      { id: 301, salonId: 3, chairNumber: 1, name: "Chair 1", barberName: "Santosh Behera", status: "available" },
      { id: 302, salonId: 3, chairNumber: 2, name: "Chair 2", barberName: "Rakesh Barik", status: "occupied", currentService: "Cut & Head Massage", currentToken: "#GT-09", serviceMinutesLeft: 10 },
      { id: 303, salonId: 3, chairNumber: 3, name: "Chair 3", barberName: "Debashis Jena", status: "available" },
      { id: 304, salonId: 3, chairNumber: 4, name: "Chair 4", barberName: "Mamata Dash", status: "finishing", currentService: "Hair Spa", currentToken: "#GT-10", serviceMinutesLeft: 2 },
    ],
    services: [
      { id: 31, name: "Trends Signature Cut & Blowdry", price: 28000, durationMins: 30 },
      { id: 32, name: "Organic Hair Spa Treatment", price: 60000, durationMins: 45 },
      { id: 33, name: "Beard Design & Trim", price: 15000, durationMins: 15 },
      { id: 34, name: "Insta Glow Fruit Facial", price: 45000, durationMins: 35 },
    ],
    barbers: [
      { id: 301, name: "Santosh Behera", role: "Master Barber", specialty: "Fade, Scissor Cut & Head Spa", rating: "4.8", reviewCount: 162, isAvailable: true },
      { id: 302, name: "Rakesh Barik", role: "Senior Stylist", specialty: "Styling & Beard Care", rating: "4.7", reviewCount: 120, isAvailable: true },
    ],
  },
  {
    id: 4,
    name: "MMT Premium Unisex Salon",
    slug: "mmt-premium-unisex-salon-patia",
    rating: "4.8",
    reviewCount: 309,
    category: "Premium Unisex Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "450/4507, GPS Tower, opposite Koel Campus, near Sitanath Residency, Patia, Bhubaneswar – 751024",
    phone: "+91 86589 62441",
    email: "mmtunisexsalon2019@gmail.com",
    hours: "Weekdays 10:00 AM – 9:30 PM; Weekends 9:30 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 8,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 401, salonId: 4, chairNumber: 1, name: "Executive Chair 1", barberName: "Tapan Mallick", status: "finishing", currentService: "Haircut", currentToken: "#M-21", serviceMinutesLeft: 5 },
      { id: 402, salonId: 4, chairNumber: 2, name: "Executive Chair 2", barberName: "Manoj Swain", status: "available" },
      { id: 403, salonId: 4, chairNumber: 3, name: "Executive Chair 3", barberName: "Subrat Dash", status: "occupied", currentService: "Beard Sculpt", currentToken: "#M-22", serviceMinutesLeft: 14 },
    ],
    services: [
      { id: 41, name: "Precision Executive Cut", price: 22000, durationMins: 30 },
      { id: 42, name: "Signature Beard Trim & Razor Lineup", price: 12000, durationMins: 15 },
      { id: 43, name: "Charcoal Detox Facial", price: 38000, durationMins: 30 },
      { id: 44, name: "Anti-Dandruff Spa Treatment", price: 55000, durationMins: 40 },
    ],
    barbers: [
      { id: 401, name: "Tapan Mallick", role: "Master Barber", specialty: "Precision Fade & Scissor Cut", rating: "4.9", reviewCount: 94, isAvailable: true },
      { id: 402, name: "Manoj Swain", role: "Stylist", specialty: "Hair Treatments & Beard Care", rating: "4.7", reviewCount: 71, isAvailable: true },
    ],
  },
  {
    id: 5,
    name: "7Sense Unisex Salon | Patia Branch",
    slug: "7sense-unisex-salon-patia",
    rating: "4.7",
    reviewCount: 446,
    category: "Premium Luxury Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "Patia Station Road, Bhubaneswar, Odisha – 751024",
    phone: "+91 91243 66099",
    email: "7sensebbsr001@gmail.com",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 3,
    availableChairs: 2,
    chairs: [
      { id: 501, salonId: 5, chairNumber: 1, name: "Luxury Bay 1", barberName: "Alok Panda", status: "available" },
      { id: 502, salonId: 5, chairNumber: 2, name: "Luxury Bay 2", barberName: "Kunal Mohapatra", status: "available" },
      { id: 503, salonId: 5, chairNumber: 3, name: "Luxury Bay 3", barberName: "Rani Tripathy", status: "occupied", currentService: "Cut & Color", currentToken: "#7S-05", serviceMinutesLeft: 18 },
    ],
    services: [
      { id: 51, name: "Creative Haircut & Scalp Massage", price: 30000, durationMins: 35 },
      { id: 52, name: "Beard Spa & Hot Towel Finish", price: 18000, durationMins: 20 },
      { id: 53, name: "Bridal Skin Radiance Therapy", price: 85000, durationMins: 50 },
      { id: 54, name: "Gel Nail Art Extensions", price: 50000, durationMins: 45 },
    ],
    barbers: [
      { id: 501, name: "Alok Panda", role: "Creative Stylist", specialty: "Texture Crop, Fades & Beard Styling", rating: "4.8", reviewCount: 104, isAvailable: true },
      { id: 502, name: "Kunal Mohapatra", role: "Senior Stylist", specialty: "Hair Coloring & Classic Cuts", rating: "4.7", reviewCount: 82, isAvailable: true },
    ],
  },
  {
    id: 6,
    name: "Beardo Studio Flagship Men's Salon",
    slug: "beardo-studio-kiit-square",
    rating: "4.8",
    reviewCount: 395,
    category: "Men's Hair & Grooming",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "KIIT Square, KIIT Road, near Apollo Villa, Patia, Bhubaneswar – 751031",
    phone: "+91 81441 42693",
    hours: "9:00 AM – 9:30 PM",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "busy",
    waitTime: 15,
    waitingCount: 2,
    totalChairs: 3,
    availableChairs: 0,
    chairs: [
      { id: 601, salonId: 6, chairNumber: 1, name: "Beardo Chair 1", barberName: "Raju Pradhan", status: "occupied", currentService: "Flagship Cut", currentToken: "#B-34", serviceMinutesLeft: 12 },
      { id: 602, salonId: 6, chairNumber: 2, name: "Beardo Chair 2", barberName: "Suraj Samal", status: "occupied", currentService: "Beard Detailing", currentToken: "#B-35", serviceMinutesLeft: 8 },
      { id: 603, salonId: 6, chairNumber: 3, name: "Beardo Chair 3", barberName: "Anil Nayak", status: "occupied", currentService: "Detox Clean-up", currentToken: "#B-36", serviceMinutesLeft: 15 },
    ],
    services: [
      { id: 61, name: "Beardo Flagship Precision Fade", price: 25000, durationMins: 30 },
      { id: 62, name: "Beard Sculpt & Charcoal Oil Steam", price: 16000, durationMins: 20 },
      { id: 63, name: "Activated Charcoal Face Clean-up", price: 35000, durationMins: 25 },
      { id: 64, name: "Deep Conditioning Scalp Scrub", price: 40000, durationMins: 30 },
    ],
    barbers: [
      { id: 601, name: "Raju Pradhan", role: "Master Barber", specialty: "Skin Fade, Beard Lineup & Razor Finish", rating: "4.9", reviewCount: 115, isAvailable: true },
      { id: 602, name: "Suraj Samal", role: "Grooming Specialist", specialty: "Beard Sculpting & Scalp Therapy", rating: "4.8", reviewCount: 92, isAvailable: true },
    ],
  },
  {
    id: 7,
    name: "Essensuals Hairdressing | KIIT Square",
    slug: "essensuals-hairdressing-kiit",
    rating: "4.9",
    reviewCount: 726,
    category: "Hairdressing & Styling",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "No. A/2, 2nd Floor, Maruti Villa, KIIT Square, Patia, Bhubaneswar – 751024",
    phone: "0674 295 2258",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 10,
    waitingCount: 1,
    totalChairs: 4,
    availableChairs: 2,
    chairs: [
      { id: 701, salonId: 7, chairNumber: 1, name: "Master Station", barberName: "Farhan Ali", status: "finishing", currentService: "Creative Cut", currentToken: "#TG-08", serviceMinutesLeft: 4 },
      { id: 702, salonId: 7, chairNumber: 2, name: "Station 2", barberName: "Pooja Roy", status: "available" },
      { id: 703, salonId: 7, chairNumber: 3, name: "Station 3", barberName: "Vivek Mishra", status: "available" },
      { id: 704, salonId: 7, chairNumber: 4, name: "Station 4", barberName: "Kavita Das", status: "occupied", currentService: "Blow Dry & Color", currentToken: "#TG-09", serviceMinutesLeft: 18 },
    ],
    services: [
      { id: 71, name: "Essensuals Creative Haircut", price: 35000, durationMins: 35 },
      { id: 72, name: "Keratin Smooth & Hair Spa", price: 80000, durationMins: 50 },
      { id: 73, name: "Beard Trim & Sculpting", price: 15000, durationMins: 15 },
      { id: 74, name: "Global Color & Balayage", price: 120000, durationMins: 90 },
    ],
    barbers: [
      { id: 701, name: "Farhan Ali", role: "Creative Director", specialty: "High Fashion Haircuts & Restyling", rating: "4.9", reviewCount: 180, isAvailable: true },
      { id: 702, name: "Pooja Roy", role: "Senior Stylist", specialty: "Keratin & Texture Treatments", rating: "4.8", reviewCount: 135, isAvailable: true },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CHANDRASEKHARPUR & NILADRI VIHAR
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 8,
    name: "Green Trends Unisex Salon | Chandrasekharpur",
    slug: "green-trends-chandrasekharpur",
    rating: "4.8",
    reviewCount: 1420,
    category: "Unisex Hair & Beauty",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 2,
    areaName: "Chandrasekharpur & Niladri Vihar",
    areaSlug: "chandrasekharpur",
    address: "No. 307C, 1st Floor, District Center, Niladri Vihar Road, above Bandhan Bank, Chandrasekharpur, Bhubaneswar – 751016",
    phone: "+91 82600 08008",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 4,
    availableChairs: 3,
    chairs: [
      { id: 801, salonId: 8, chairNumber: 1, name: "Station 1", barberName: "Chandan Rout", status: "available" },
      { id: 802, salonId: 8, chairNumber: 2, name: "Station 2", barberName: "Pradeep Sahu", status: "available" },
      { id: 803, salonId: 8, chairNumber: 3, name: "Station 3", barberName: "Bijay Mohanty", status: "occupied", currentService: "Cut & Beard", currentToken: "#GTC-04", serviceMinutesLeft: 10 },
      { id: 804, salonId: 8, chairNumber: 4, name: "Station 4", barberName: "Smita Parida", status: "available" },
    ],
    services: [
      { id: 81, name: "Trends Classic Cut & Blowdry", price: 28000, durationMins: 30 },
      { id: 82, name: "Beard Design & Lineup", price: 14000, durationMins: 15 },
      { id: 83, name: "Herbal Nourishing Hair Spa", price: 55000, durationMins: 40 },
      { id: 84, name: "Gold Radiance Clean-up", price: 42000, durationMins: 30 },
    ],
    barbers: [
      { id: 801, name: "Chandan Rout", role: "Senior Stylist", specialty: "Layer Cuts, Fades & Beard Styling", rating: "4.8", reviewCount: 112, isAvailable: true },
      { id: 802, name: "Pradeep Sahu", role: "Stylist", specialty: "Hair Spa & Grooming", rating: "4.7", reviewCount: 86, isAvailable: true },
    ],
  },
  {
    id: 9,
    name: "Level Up Studio Unisex Salon",
    slug: "level-up-studio-niladri-vihar",
    rating: "4.9",
    reviewCount: 22,
    category: "Hair Services & Styling",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 2,
    areaName: "Chandrasekharpur & Niladri Vihar",
    areaSlug: "chandrasekharpur",
    address: "Plot No. 1/11, Sector 1, Niladri Vihar, Chandrasekharpur, Bhubaneswar – 751021",
    phone: "+91 79780 04094",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 5,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 2,
    chairs: [
      { id: 901, salonId: 9, chairNumber: 1, name: "Chair 1", barberName: "Rakesh Barik", status: "available" },
      { id: 902, salonId: 9, chairNumber: 2, name: "Chair 2", barberName: "Laxman Jena", status: "occupied", currentService: "Level Up Fade", currentToken: "#LU-03", serviceMinutesLeft: 5 },
      { id: 903, salonId: 9, chairNumber: 3, name: "Chair 3", barberName: "Deepak Sahoo", status: "available" },
    ],
    services: [
      { id: 91, name: "Level Up Signature Scissor Cut", price: 20000, durationMins: 30 },
      { id: 92, name: "Sharp Beard Sculpt & Shave", price: 10000, durationMins: 15 },
      { id: 93, name: "Intense Moisture Hair Spa", price: 50000, durationMins: 40 },
    ],
    barbers: [
      { id: 901, name: "Rakesh Barik", role: "Head Barber", specialty: "Texture Crop, Fade & Beard Lineup", rating: "4.9", reviewCount: 22, isAvailable: true },
    ],
  },
  {
    id: 10,
    name: "Buddha Salon & Spa",
    slug: "buddha-salon-and-spa-cspur",
    rating: "4.8",
    reviewCount: 580,
    category: "Salon & Spa Services",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 2,
    areaName: "Chandrasekharpur & Niladri Vihar",
    areaSlug: "chandrasekharpur",
    address: "Royal Towers, 331/94, Nandankanan Road, Housing Board Colony, Chandrasekharpur, Bhubaneswar – 751017",
    phone: "+91 98278 48603",
    email: "budhhaspa143@gmail.com",
    hours: "9:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 3,
    availableChairs: 2,
    chairs: [
      { id: 1001, salonId: 10, chairNumber: 1, name: "Spa Station 1", barberName: "Bikash Rout", status: "available" },
      { id: 1002, salonId: 10, chairNumber: 2, name: "Spa Station 2", barberName: "Ranjit Das", status: "available" },
      { id: 1003, salonId: 10, chairNumber: 3, name: "Spa Station 3", barberName: "Lipika Nayak", status: "occupied", currentService: "Detox Spa", currentToken: "#B-07", serviceMinutesLeft: 15 },
    ],
    services: [
      { id: 101, name: "Ayurvedic Head Massage & Wash", price: 25000, durationMins: 30 },
      { id: 102, name: "Precision Haircut & Style", price: 22000, durationMins: 25 },
      { id: 103, name: "Deep Relaxing Body Spa", price: 95000, durationMins: 60 },
      { id: 104, name: "Herbal Facial Rejuvenation", price: 45000, durationMins: 40 },
    ],
    barbers: [
      { id: 1001, name: "Bikash Rout", role: "Spa & Hair Director", specialty: "Ayurvedic Scalp Therapy & Cuts", rating: "4.8", reviewCount: 140, isAvailable: true },
      { id: 1002, name: "Ranjit Das", role: "Therapist & Stylist", specialty: "Relaxation Spa & Grooming", rating: "4.8", reviewCount: 95, isAvailable: true },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. JAYADEV VIHAR
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 11,
    name: "Green Trends Unisex Salon | Jayadev Vihar",
    slug: "green-trends-jayadev-vihar",
    rating: "4.7",
    reviewCount: 1890,
    category: "Unisex Hair & Beauty",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 3,
    areaName: "Jayadev Vihar",
    areaSlug: "jayadev-vihar",
    address: "No. 504, Nicco Park Road, Jayadev Vihar, Old Nayapalli, opposite IndianOil, Bhubaneswar – 751012",
    phone: "+91 98611 99940",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 4,
    availableChairs: 2,
    chairs: [
      { id: 1101, salonId: 11, chairNumber: 1, name: "Station 1", barberName: "Pradeep Sahu", status: "available" },
      { id: 1102, salonId: 11, chairNumber: 2, name: "Station 2", barberName: "Sanjay Swain", status: "occupied", currentService: "Cut & Beard", currentToken: "#GTJ-12", serviceMinutesLeft: 8 },
      { id: 1103, salonId: 11, chairNumber: 3, name: "Station 3", barberName: "Pooja Roy", status: "available" },
      { id: 1104, salonId: 11, chairNumber: 4, name: "Station 4", barberName: "Gita Jena", status: "finishing", currentService: "Blowdry", currentToken: "#GTJ-13", serviceMinutesLeft: 3 },
    ],
    services: [
      { id: 111, name: "Trends Designer Haircut", price: 28000, durationMins: 30 },
      { id: 112, name: "Beard Styling & Lineup", price: 14000, durationMins: 15 },
      { id: 113, name: "Intense Keratin Hair Spa", price: 65000, durationMins: 45 },
      { id: 114, name: "Insta Glow Clean-up", price: 40000, durationMins: 30 },
    ],
    barbers: [
      { id: 1101, name: "Pradeep Sahu", role: "Master Stylist", specialty: "Fade, Layer Cuts & Beard Styling", rating: "4.8", reviewCount: 145, isAvailable: true },
      { id: 1102, name: "Sanjay Swain", role: "Senior Barber", specialty: "Classic Haircut & Head Spa", rating: "4.7", reviewCount: 110, isAvailable: true },
    ],
  },
  {
    id: 12,
    name: "Indulge The Salon | Pal Heights",
    slug: "indulge-the-salon-pal-heights",
    rating: "4.6",
    reviewCount: 1130,
    category: "Salon & Beauty Services",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 3,
    areaName: "Jayadev Vihar",
    areaSlug: "jayadev-vihar",
    address: "3rd Floor, Pal Heights Mall, Jayadev Vihar, Bhubaneswar – 751013",
    phone: "+91 674 236 0111",
    hours: "10:30 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 10,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 1201, salonId: 12, chairNumber: 1, name: "Lounge Chair 1", barberName: "Rakesh Barik", status: "finishing", currentService: "Luxury Haircut", currentToken: "#IND-04", serviceMinutesLeft: 5 },
      { id: 1202, salonId: 12, chairNumber: 2, name: "Lounge Chair 2", barberName: "Kunal Mohapatra", status: "available" },
      { id: 1203, salonId: 12, chairNumber: 3, name: "Lounge Chair 3", barberName: "Sunita Jena", status: "occupied", currentService: "Hair Spa", currentToken: "#IND-05", serviceMinutesLeft: 18 },
    ],
    services: [
      { id: 121, name: "Pal Heights Signature Haircut", price: 35000, durationMins: 35 },
      { id: 122, name: "Luxury Beard Shave & Hot Towel", price: 20000, durationMins: 20 },
      { id: 123, name: "Deep Rejuvenation Hair Spa", price: 70000, durationMins: 45 },
      { id: 124, name: "Premium Hydra-Facial Treatment", price: 90000, durationMins: 50 },
    ],
    barbers: [
      { id: 1201, name: "Rakesh Barik", role: "Creative Director", specialty: "Luxury Hair Styling & Fades", rating: "4.7", reviewCount: 125, isAvailable: true },
      { id: 1202, name: "Kunal Mohapatra", role: "Senior Stylist", specialty: "Beard Sculpting & Scalp Spa", rating: "4.6", reviewCount: 98, isAvailable: true },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. GAJAPATI NAGAR
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 13,
    name: "7Sense Unisex Salon | Gajapati Nagar Branch",
    slug: "7sense-unisex-salon-gajapati-nagar",
    rating: "4.8",
    reviewCount: 312,
    category: "Premium Luxury Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 4,
    areaName: "Gajapati Nagar",
    areaSlug: "gajapati-nagar",
    address: "Plot No. 1731/1732, Gajapati Nagar, Bhubaneswar, Odisha",
    phone: "+91 98615 94859",
    email: "7sensebbsr@gmail.com",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 3,
    availableChairs: 2,
    chairs: [
      { id: 1301, salonId: 13, chairNumber: 1, name: "Bay 1", barberName: "Debashis Jena", status: "available" },
      { id: 1302, salonId: 13, chairNumber: 2, name: "Bay 2", barberName: "Alok Panda", status: "available" },
      { id: 1303, salonId: 13, chairNumber: 3, name: "Bay 3", barberName: "Mamata Dash", status: "occupied", currentService: "Cut & Facial", currentToken: "#7G-02", serviceMinutesLeft: 12 },
    ],
    services: [
      { id: 131, name: "Luxury Precision Haircut", price: 30000, durationMins: 35 },
      { id: 132, name: "Beard Sculpt & Charcoal Spa", price: 18000, durationMins: 20 },
      { id: 133, name: "Bridal & Party Styling Consult", price: 80000, durationMins: 45 },
      { id: 134, name: "Herbal Detox Facial", price: 45000, durationMins: 35 },
    ],
    barbers: [
      { id: 1301, name: "Debashis Jena", role: "Creative Director", specialty: "Precision Fade & Hair Spa", rating: "4.9", reviewCount: 88, isAvailable: true },
      { id: 1302, name: "Alok Panda", role: "Senior Stylist", specialty: "Styling & Beard Care", rating: "4.8", reviewCount: 76, isAvailable: true },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // 14. SAHEED NAGAR - THE SCISSORS EDGE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 14,
    name: "The Scissors Edge",
    slug: "the-scissors-edge",
    rating: "4.8",
    reviewCount: 142,
    category: "Unisex Grooming, Styling & Skin",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 5,
    areaName: "Saheed Nagar",
    areaSlug: "saheed-nagar",
    address: "Plot 142, Janpath Road, opposite Rama Devi College, Saheed Nagar, Bhubaneswar – 751007",
    phone: "+91 94370 44221",
    email: "contact@scissorsedgebbsr.com",
    hours: "9:30 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 8,
    waitingCount: 2,
    totalChairs: 4,
    availableChairs: 2,
    lat: 20.2901,
    lng: 85.8456,
    googleMapsUrl: "https://maps.google.com/?q=Saheed+Nagar+Bhubaneswar",
    description: "Saheed Nagar's premier unisex studio for precision haircuts, beard sculpting, and restorative hair spa treatments.",
    chairs: [
      { id: 1401, salonId: 14, chairNumber: 1, name: "Chair 01", barberName: "Rakesh Nayak", status: "occupied", currentService: "Haircut", currentToken: "#A05", serviceMinutesLeft: 8 },
      { id: 1402, salonId: 14, chairNumber: 2, name: "Chair 02", barberName: "Priyanka Sahoo", status: "available" },
      { id: 1403, salonId: 14, chairNumber: 3, name: "Chair 03", barberName: "Sameer Mohanty", status: "available" },
      { id: 1404, salonId: 14, chairNumber: 4, name: "Chair 04", barberName: "Debasis Jena", status: "occupied", currentService: "Beard Sculpt", currentToken: "#A06", serviceMinutesLeft: 14 },
    ],
    services: [
      { id: 141, name: "Signature Haircut & Styling", price: 28000, durationMins: 30 },
      { id: 142, name: "Beard Sculpt & Razor Finish", price: 15000, durationMins: 15 },
      { id: 143, name: "Deep Nourishing Hair Spa", price: 65000, durationMins: 45 },
      { id: 144, name: "Charcoal Face Clean-up", price: 40000, durationMins: 30 },
    ],
    barbers: [
      { id: 141, name: "Sameer Mohanty", role: "Master Stylist", specialty: "Fade, Texture Crop & Beard Sculpt", rating: "4.9", reviewCount: 84, isAvailable: true },
      { id: 142, name: "Priyanka Sahoo", role: "Senior Stylist", specialty: "Layered Cut, Hair Spa & Styling", rating: "4.8", reviewCount: 58, isAvailable: true },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // 15. KIIT SQUARE - ROYALE BARBER CLUB
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 15,
    name: "Royale Barber Club",
    slug: "royale-barber-club",
    rating: "4.8",
    reviewCount: 112,
    category: "Men's Luxury Grooming & Fade Bar",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia & KIIT Square",
    areaSlug: "patia",
    address: "Campus 3 Road, Opposite KIIT Gate 1, Patia, Bhubaneswar – 751024",
    phone: "+91 98610 88219",
    hours: "9:00 AM – 9:30 PM",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 4,
    waitingCount: 1,
    totalChairs: 4,
    availableChairs: 3,
    lat: 20.3548,
    lng: 85.8174,
    googleMapsUrl: "https://maps.google.com/?q=KIIT+Square+Patia+Bhubaneswar",
    description: "Dedicated men's grooming and skin club specializing in skin fades, beard shaping, hot towel shaves, and scalp therapy.",
    chairs: [
      { id: 1501, salonId: 15, chairNumber: 1, name: "Chair 01", barberName: "Amir Khan", status: "occupied", currentService: "Fade & Taper", currentToken: "#R04", serviceMinutesLeft: 5 },
      { id: 1502, salonId: 15, chairNumber: 2, name: "Chair 02", barberName: "Bikram Rout", status: "available" },
      { id: 1503, salonId: 15, chairNumber: 3, name: "Chair 03", barberName: "Manoj Das", status: "available" },
      { id: 1504, salonId: 15, chairNumber: 4, name: "Chair 04", barberName: "Sunil Pradhan", status: "available" },
    ],
    services: [
      { id: 151, name: "Fade and Taper Haircut", price: 20000, durationMins: 25 },
      { id: 152, name: "Hot Towel Shave & Beard Oil", price: 12000, durationMins: 15 },
      { id: 153, name: "Beard Oil Spa & Scalp Massage", price: 25000, durationMins: 20 },
    ],
    barbers: [
      { id: 151, name: "Amir Khan", role: "Fade Specialist", specialty: "Skin Fade, Scissor Work", rating: "4.9", reviewCount: 65, isAvailable: true },
      { id: 152, name: "Bikram Rout", role: "Senior Barber", specialty: "Beard Sculpting & Classic Cuts", rating: "4.8", reviewCount: 47, isAvailable: true },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // 16. NAYAPALLI - OZONE STUDIO AND SPA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 16,
    name: "Ozone Studio and Spa",
    slug: "ozone-studio-nayapalli",
    rating: "4.7",
    reviewCount: 139,
    category: "Premium Hair & Wellness Spa",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 6,
    areaName: "Nayapalli",
    areaSlug: "nayapalli",
    address: "Near IRC Village Community Hall, Nayapalli, Bhubaneswar – 751015",
    phone: "+91 93370 19283",
    hours: "10:00 AM – 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 8,
    waitingCount: 2,
    totalChairs: 4,
    availableChairs: 2,
    lat: 20.3012,
    lng: 85.8198,
    googleMapsUrl: "https://maps.google.com/?q=IRC+Village+Nayapalli+Bhubaneswar",
    description: "Full service luxury wellness and hair spa studio offering signature styling, organic hair spa, and facial rejuvenation.",
    chairs: [
      { id: 1601, salonId: 16, chairNumber: 1, name: "Station 01", barberName: "Ananya Mishra", status: "occupied", currentService: "Detox Facial", currentToken: "#O02", serviceMinutesLeft: 12 },
      { id: 1602, salonId: 16, chairNumber: 2, name: "Station 02", barberName: "Rajat Mohanty", status: "available" },
      { id: 1603, salonId: 16, chairNumber: 3, name: "Station 03", barberName: "Pooja Ray", status: "available" },
      { id: 1604, salonId: 16, chairNumber: 4, name: "Station 04", barberName: "Suraj Nayak", status: "occupied", currentService: "Haircut", currentToken: "#O03", serviceMinutesLeft: 6 },
    ],
    services: [
      { id: 161, name: "Men's Luxury Grooming", price: 32000, durationMins: 35 },
      { id: 162, name: "Hair Therapy & Spa", price: 55000, durationMins: 40 },
      { id: 163, name: "Detox Facial Clean-up", price: 45000, durationMins: 30 },
    ],
    barbers: [
      { id: 161, name: "Rajat Mohanty", role: "Creative Stylist", specialty: "Texture Haircut, Beard Styling", rating: "4.8", reviewCount: 52, isAvailable: true },
      { id: 162, name: "Ananya Mishra", role: "Skin & Spa Specialist", specialty: "Facials, Hair Spa, Make-up", rating: "4.9", reviewCount: 71, isAvailable: true },
    ],
  },

];

// ─── QUERY HELPERS ───
export function getCities(): City[] {
  return CITIES;
}

export function getAreas(cityId: number = 1): Area[] {
  return BHUBANESWAR_AREAS.filter((a) => a.cityId === cityId).map((a) => {
    const count = REAL_SALONS_DATA.filter((s) => s.areaId === a.id).length;
    return { ...a, salonCount: count };
  });
}

export function getAreaBySlug(slug: string): Area | undefined {
  return BHUBANESWAR_AREAS.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
}

export function getSalonsByArea(areaIdOrSlug: number | string): RealSalon[] {
  if (typeof areaIdOrSlug === "number") {
    return REAL_SALONS_DATA.filter((s) => s.areaId === areaIdOrSlug);
  }
  const area = getAreaBySlug(areaIdOrSlug);
  if (!area) return [];
  return REAL_SALONS_DATA.filter((s) => s.areaId === area.id);
}

export function getSalonBySlug(slug: string): RealSalon | undefined {
  const norm = slug.toLowerCase().trim();
  const aliasMap: Record<string, string> = {
    "scissors-edge": "the-scissors-edge",
    "the-scissors-edge": "the-scissors-edge",
    "royale-barber": "royale-barber-club",
    "royale-barber-club": "royale-barber-club",
    "ozone-studio": "ozone-studio-nayapalli",
    "ozone-studio-nayapalli": "ozone-studio-nayapalli",
    "lakme-kiit": "lakme-salon-patia",
    "green-trends-cspur": "green-trends-chandrasekharpur",
  };
  const targetSlug = aliasMap[norm] || norm;
  return REAL_SALONS_DATA.find((s) => s.slug.toLowerCase() === targetSlug || s.slug.toLowerCase() === norm);
}

export function getSalonById(id: number): RealSalon | undefined {
  return REAL_SALONS_DATA.find((s) => s.id === id);
}

export function searchSalons(query: string, areaId?: number): RealSalon[] {
  let list = [...REAL_SALONS_DATA];
  if (areaId) {
    list = list.filter((s) => s.areaId === areaId);
  }
  if (!query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.areaName.toLowerCase().includes(q)
  );
}

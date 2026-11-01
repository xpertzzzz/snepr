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
}

export const CITIES: City[] = [
  { id: 1, name: "Bhubaneswar", state: "Odisha", slug: "bhubaneswar", isActive: true },
];

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

export const DEFAULT_SERVICES = [
  { id: 1, name: "Signature Precision Haircut", price: 15000, durationMins: 30, discountPercent: 0 },
  { id: 2, name: "Beard Sculpt & Razor Shape", price: 8000, durationMins: 15, discountPercent: 0 },
  { id: 3, name: "Hair Wash & Relaxing Massage", price: 12000, durationMins: 20, discountPercent: 0 },
  { id: 4, name: "Charcoal Detox Clean-up", price: 35000, durationMins: 30, discountPercent: 10 },
  { id: 5, name: "Deep Nourishing Hair Spa", price: 60000, durationMins: 45, discountPercent: 15 },
];

export const DEFAULT_BARBERS = [
  { id: 1, name: "Sameer Mohanty", role: "Master Stylist", specialty: "Fade, Texture Crop & Beard Sculpt", rating: "4.9", reviewCount: 84, isAvailable: true },
  { id: 2, name: "Rahul Sen", role: "Senior Barber", specialty: "Classic Scissor Cuts & Hair Spa", rating: "4.7", reviewCount: 62, isAvailable: true },
  { id: 3, name: "Bikash Rout", role: "Stylist", specialty: "Hair Color & Modern Layers", rating: "4.8", reviewCount: 39, isAvailable: false },
];

export const REAL_SALONS_DATA: RealSalon[] = [
  // ─── PATIA (Area 1) ───
  {
    id: 1,
    name: "Lakme Salon Patia",
    slug: "lakme-salon-patia",
    rating: "4.8",
    reviewCount: 2554,
    category: "Beauty & Unisex",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia",
    areaSlug: "patia",
    address: "1st Floor, Khata 474/156, KIIT Rd, In front of Manyavar, Patia",
    phone: "+91 674 274 1234",
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
      { id: 104, salonId: 1, chairNumber: 4, name: "Station 4", barberName: "Deepak Dash", status: "finishing", currentService: "Hair Spa", currentToken: "#A-103", serviceMinutesLeft: 3 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
  {
    id: 4,
    name: "J'Lone Luxury Unisex Salon",
    slug: "jlone-luxury-salon",
    rating: "4.9",
    reviewCount: 1095,
    category: "Luxury Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia",
    areaSlug: "patia",
    address: "Food Court, Plot 36/A, Infocity Ave, Patia",
    phone: "+91 674 274 5544",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 3,
    availableChairs: 2,
    chairs: [
      { id: 401, salonId: 4, chairNumber: 1, name: "Styling Bay 1", barberName: "Aman Verma", status: "available" },
      { id: 402, salonId: 4, chairNumber: 2, name: "Styling Bay 2", barberName: "Tanya Sen", status: "available" },
      { id: 403, salonId: 4, chairNumber: 3, name: "VIP Lounge", barberName: "Rohit Paul", status: "occupied", currentService: "Cut & Color", currentToken: "#J-11", serviceMinutesLeft: 15 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
  {
    id: 7,
    name: "Looks Salon Patia",
    slug: "looks-salon-patia",
    rating: "4.7",
    reviewCount: 379,
    category: "Unisex Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia",
    areaSlug: "patia",
    address: "1st Floor, Prakriti Tower, Magnetic Square, Patia",
    phone: "+91 674 274 8899",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 4,
    availableChairs: 3,
    chairs: [
      { id: 701, salonId: 7, chairNumber: 1, name: "Chair A", barberName: "Kunal Mohapatra", status: "available" },
      { id: 702, salonId: 7, chairNumber: 2, name: "Chair B", barberName: "Santosh Behera", status: "available" },
      { id: 703, salonId: 7, chairNumber: 3, name: "Chair C", barberName: "Manoj Swain", status: "available" },
      { id: 704, salonId: 7, chairNumber: 4, name: "Chair D", barberName: "Pooja Ray", status: "break" },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
  {
    id: 11,
    name: "7sense Unisex Salon & Academy",
    slug: "7sense-unisex-salon-patia",
    rating: "4.7",
    reviewCount: 446,
    category: "Unisex Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 1,
    areaName: "Patia",
    areaSlug: "patia",
    address: "Near Lafamme Fitness, Nandan Kanan - Patia Station Rd",
    phone: "+91 674 274 1122",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 8,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 1101, salonId: 11, chairNumber: 1, name: "Chair 1", barberName: "Debasis Jena", status: "finishing", currentService: "Haircut", currentToken: "#S-04", serviceMinutesLeft: 5 },
      { id: 1102, salonId: 11, chairNumber: 2, name: "Chair 2", barberName: "Subrat Dash", status: "available" },
      { id: 1103, salonId: 11, chairNumber: 3, name: "Chair 3", barberName: "Alok Panda", status: "occupied", currentService: "Beard & Trim", currentToken: "#S-05", serviceMinutesLeft: 10 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── KIIT ROAD (Area 2) ───
  {
    id: 5,
    name: "Holy Hair Salon",
    slug: "holy-hair-salon-kiit-road",
    rating: "4.7",
    reviewCount: 207,
    category: "Men's Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 2,
    areaName: "KIIT Road",
    areaSlug: "kiit-road",
    address: "KIIT Rd, Near Biggies Burger, Behind Axis Bank, Bhubaneswar",
    phone: "+91 98612 34567",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 5,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 501, salonId: 5, chairNumber: 1, name: "Chair 1", barberName: "Sameer Mohanty", status: "available" },
      { id: 502, salonId: 5, chairNumber: 2, name: "Chair 2", barberName: "Rahul Sen", status: "occupied", currentService: "Fade Cut", currentToken: "#H-21", serviceMinutesLeft: 5 },
      { id: 503, salonId: 5, chairNumber: 3, name: "Chair 3", barberName: "Bikash Rout", status: "occupied", currentService: "Beard Sculpt", currentToken: "#H-22", serviceMinutesLeft: 10 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
  {
    id: 6,
    name: "Toni&Guy Essensuals KIIT Road",
    slug: "toni-and-guy-kiit-road",
    rating: "4.9",
    reviewCount: 726,
    category: "Premium Styling",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 2,
    areaName: "KIIT Road",
    areaSlug: "kiit-road",
    address: "2nd Floor, Maruti Villa, A/2, KIIT Rd, Bhubaneswar",
    phone: "+91 674 274 3322",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 12,
    waitingCount: 2,
    totalChairs: 4,
    availableChairs: 1,
    chairs: [
      { id: 601, salonId: 6, chairNumber: 1, name: "Master Station", barberName: "Farhan Ali", status: "finishing", currentService: "Creative Cut", currentToken: "#TG-08", serviceMinutesLeft: 4 },
      { id: 602, salonId: 6, chairNumber: 2, name: "Station 2", barberName: "Pooja Roy", status: "available" },
      { id: 603, salonId: 6, chairNumber: 3, name: "Station 3", barberName: "Vivek Mishra", status: "occupied", currentService: "Keratin Spa", currentToken: "#TG-09", serviceMinutesLeft: 20 },
      { id: 604, salonId: 6, chairNumber: 4, name: "Station 4", barberName: "Kavita Das", status: "occupied", currentService: "Blow Dry", currentToken: "#TG-10", serviceMinutesLeft: 8 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
  {
    id: 9,
    name: "Beardo Studio Flagship Men's Salon",
    slug: "beardo-studio-kiit-road",
    rating: "4.8",
    reviewCount: 395,
    category: "Men's Grooming",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 2,
    areaName: "KIIT Road",
    areaSlug: "kiit-road",
    address: "KIIT Rd, Near Apollo Villa, Bhubaneswar",
    phone: "+91 97760 98765",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "busy",
    waitTime: 15,
    waitingCount: 3,
    totalChairs: 3,
    availableChairs: 0,
    chairs: [
      { id: 901, salonId: 9, chairNumber: 1, name: "Chair 1", barberName: "Raju Pradhan", status: "occupied", currentService: "Signature Cut", currentToken: "#B-34", serviceMinutesLeft: 12 },
      { id: 902, salonId: 9, chairNumber: 2, name: "Chair 2", barberName: "Suraj Samal", status: "occupied", currentService: "Beard Detailing", currentToken: "#B-35", serviceMinutesLeft: 10 },
      { id: 903, salonId: 9, chairNumber: 3, name: "Chair 3", barberName: "Anil Nayak", status: "occupied", currentService: "Detox Clean-up", currentToken: "#B-36", serviceMinutesLeft: 15 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── SAHEED NAGAR (Area 3) ───
  {
    id: 17,
    name: "The Scissors Edge",
    slug: "the-scissors-edge-saheed-nagar",
    rating: "4.8",
    reviewCount: 412,
    category: "Unisex Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 3,
    areaName: "Saheed Nagar",
    areaSlug: "saheed-nagar",
    address: "Plot 104, Near Alok Bharati Tower, Saheed Nagar",
    phone: "+91 674 254 7890",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 5,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 2,
    chairs: [
      { id: 1701, salonId: 17, chairNumber: 1, name: "Chair 1", barberName: "Sanjay Swain", status: "available" },
      { id: 1702, salonId: 17, chairNumber: 2, name: "Chair 2", barberName: "Rakesh Barik", status: "occupied", currentService: "Haircut", currentToken: "#SE-14", serviceMinutesLeft: 5 },
      { id: 1703, salonId: 17, chairNumber: 3, name: "Chair 3", barberName: "Bijay Mohanty", status: "available" },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
  {
    id: 18,
    name: "Classic Grooming Lounge",
    slug: "classic-grooming-saheed-nagar",
    rating: "4.7",
    reviewCount: 188,
    category: "Men's Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 3,
    areaName: "Saheed Nagar",
    areaSlug: "saheed-nagar",
    address: "B/14, Maharshi College Rd, Saheed Nagar",
    phone: "+91 674 254 3321",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 2,
    availableChairs: 2,
    chairs: [
      { id: 1801, salonId: 18, chairNumber: 1, name: "Station 1", barberName: "Chandan Rout", status: "available" },
      { id: 1802, salonId: 18, chairNumber: 2, name: "Station 2", barberName: "Pradeep Sahu", status: "available" },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── JAYDEV VIHAR (Area 4) ───
  {
    id: 19,
    name: "Urban Look Salon",
    slug: "urban-look-jaydev-vihar",
    rating: "4.6",
    reviewCount: 520,
    category: "Men's & Unisex",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 4,
    areaName: "Jaydev Vihar",
    areaSlug: "jaydev-vihar",
    address: "Near Pal Heights Mall, Jaydev Vihar, Bhubaneswar",
    phone: "+91 674 236 1122",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 10,
    waitingCount: 2,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 1901, salonId: 19, chairNumber: 1, name: "Chair 1", barberName: "Niranjan Das", status: "available" },
      { id: 1902, salonId: 19, chairNumber: 2, name: "Chair 2", barberName: "Manas Jena", status: "occupied", currentService: "Fade Cut", currentToken: "#UL-42", serviceMinutesLeft: 8 },
      { id: 1903, salonId: 19, chairNumber: 3, name: "Chair 3", barberName: "Ashok Barik", status: "occupied", currentService: "Hair Color", currentToken: "#UL-43", serviceMinutesLeft: 12 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── CHANDRASEKHARPUR (Area 5) ───
  {
    id: 2,
    name: "The Jawed Habib Salon",
    slug: "jawed-habib-chandrasekharpur",
    rating: "4.9",
    reviewCount: 2373,
    category: "Unisex Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 5,
    areaName: "Chandrasekharpur",
    areaSlug: "chandrasekharpur",
    address: "Royal Towers, Nandankanan Rd, Damana Square, Chandrasekharpur",
    phone: "+91 674 272 5678",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 5,
    waitingCount: 1,
    totalChairs: 5,
    availableChairs: 2,
    chairs: [
      { id: 201, salonId: 2, chairNumber: 1, name: "Master Chair", barberName: "Habib Certified Barber", status: "available" },
      { id: 202, salonId: 2, chairNumber: 2, name: "Stylist 2", barberName: "Laxman Behera", status: "available" },
      { id: 203, salonId: 2, chairNumber: 3, name: "Stylist 3", barberName: "Papu Nayak", status: "occupied", currentService: "Haircut", currentToken: "#JH-88", serviceMinutesLeft: 5 },
      { id: 204, salonId: 2, chairNumber: 4, name: "Stylist 4", barberName: "Swati Moharana", status: "break" },
      { id: 205, salonId: 2, chairNumber: 5, name: "Stylist 5", barberName: "Dipak Sen", status: "occupied", currentService: "Hair Spa", currentToken: "#JH-89", serviceMinutesLeft: 18 },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── RASULGARH (Area 6) ───
  {
    id: 20,
    name: "Crown & Comb Studio",
    slug: "crown-and-comb-rasulgarh",
    rating: "4.8",
    reviewCount: 215,
    category: "Premium Unisex",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 6,
    areaName: "Rasulgarh",
    areaSlug: "rasulgarh",
    address: "Near Esplanade One Mall, Rasulgarh Square",
    phone: "+91 674 258 9012",
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 0,
    waitingCount: 0,
    totalChairs: 3,
    availableChairs: 3,
    chairs: [
      { id: 2001, salonId: 20, chairNumber: 1, name: "Chair 1", barberName: "Ganesh Mohanty", status: "available" },
      { id: 2002, salonId: 20, chairNumber: 2, name: "Chair 2", barberName: "Sita Das", status: "available" },
      { id: 2003, salonId: 20, chairNumber: 3, name: "Chair 3", barberName: "Kailash Rout", status: "available" },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── NAYAPALLI (Area 7) ───
  {
    id: 21,
    name: "Studio 11 Salon & Spa",
    slug: "studio-11-nayapalli",
    rating: "4.7",
    reviewCount: 340,
    category: "Spa & Salon",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 7,
    areaName: "Nayapalli",
    areaSlug: "nayapalli",
    address: "IRC Village, Near CRP Square, Nayapalli",
    phone: "+91 674 255 4400",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "finishing",
    waitTime: 8,
    waitingCount: 1,
    totalChairs: 4,
    availableChairs: 2,
    chairs: [
      { id: 2101, salonId: 21, chairNumber: 1, name: "Station 1", barberName: "Pranab Ray", status: "available" },
      { id: 2102, salonId: 21, chairNumber: 2, name: "Station 2", barberName: "Nisha Nayak", status: "available" },
      { id: 2103, salonId: 21, chairNumber: 3, name: "Station 3", barberName: "Tushar Sahoo", status: "finishing", currentService: "Cut & Beard", currentToken: "#S11-06", serviceMinutesLeft: 6 },
      { id: 2104, salonId: 21, chairNumber: 4, name: "Station 4", barberName: "Mamata Jena", status: "break" },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },

  // ─── KHANDAGIRI (Area 8) ───
  {
    id: 22,
    name: "Habib Hair Express",
    slug: "habib-hair-express-khandagiri",
    rating: "4.6",
    reviewCount: 198,
    category: "Budget Unisex",
    cityId: 1,
    cityName: "Bhubaneswar",
    citySlug: "bhubaneswar",
    areaId: 8,
    areaName: "Khandagiri",
    areaSlug: "khandagiri",
    address: "Khandagiri Chhak, Near Caves Entrance, Bhubaneswar",
    phone: "+91 674 238 6711",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    verificationStatus: "verified",
    operationalStatus: "active",
    queueStatus: "available",
    waitTime: 5,
    waitingCount: 1,
    totalChairs: 3,
    availableChairs: 1,
    chairs: [
      { id: 2201, salonId: 22, chairNumber: 1, name: "Chair 1", barberName: "Babula Barik", status: "available" },
      { id: 2202, salonId: 22, chairNumber: 2, name: "Chair 2", barberName: "Mantu Jena", status: "occupied", currentService: "Classic Haircut", currentToken: "#HE-19", serviceMinutesLeft: 5 },
      { id: 2203, salonId: 22, chairNumber: 3, name: "Chair 3", barberName: "Ranjit Swain", status: "break" },
    ],
    services: DEFAULT_SERVICES,
    barbers: DEFAULT_BARBERS,
  },
];

// Helper functions for Locality Discovery
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

export function getSalonsByArea(
  areaId?: number,
  sort: "wait" | "rating" | "name" = "wait",
  search?: string,
  category?: string,
  availableOnly?: boolean
): RealSalon[] {
  let list = [...REAL_SALONS_DATA];

  if (areaId) {
    list = list.filter((s) => s.areaId === areaId);
  }

  if (category && category !== "All") {
    list = list.filter((s) => s.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (availableOnly) {
    list = list.filter((s) => s.queueStatus === "available" || s.availableChairs > 0);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.areaName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.services.some((svc) => svc.name.toLowerCase().includes(q))
    );
  }

  if (sort === "wait") {
    list.sort((a, b) => a.waitTime - b.waitTime);
  } else if (sort === "rating") {
    list.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/real-salons.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update RealSalon interface to include lat, lng, googleMapsUrl, description
interface_old = """  services: Array<{ id: number; name: string; price: number; durationMins: number; discountPercent?: number }>;
  barbers: Array<{ id: number; name: string; role: string; specialty: string; rating: string; reviewCount: number; isAvailable: boolean }>;
}"""

interface_new = """  services: Array<{ id: number; name: string; price: number; durationMins: number; discountPercent?: number }>;
  barbers: Array<{ id: number; name: string; role: string; specialty: string; rating: string; reviewCount: number; isAvailable: boolean }>;
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
  description?: string;
}"""

if interface_old in code:
    code = code.replace(interface_old, interface_new, 1)
    print("Updated RealSalon interface successfully")
else:
    print("Warning: interface_old not found")

# 2. Add extra salons to REAL_SALONS_DATA before line 638
extra_salons = """  // ──────────────────────────────────────────────────────────────────────────
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
"""

# Insert before end of REAL_SALONS_DATA array:
marker = "\n];\n\n// ─── QUERY HELPERS ───"
if marker in code:
    code = code.replace(marker, "\n" + extra_salons + marker, 1)
    print("Added extra salons successfully")
else:
    print("Warning: marker not found")

# 3. Update getSalonBySlug to handle aliases
slug_old = """export function getSalonBySlug(slug: string): RealSalon | undefined {
  return REAL_SALONS_DATA.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}"""

slug_new = """export function getSalonBySlug(slug: string): RealSalon | undefined {
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
}"""

if slug_old in code:
    code = code.replace(slug_old, slug_new, 1)
    print("Updated getSalonBySlug successfully")
else:
    print("Warning: slug_old not found")

with open('src/lib/real-salons.ts', 'w', encoding='utf-8') as f:
    f.write(code)
print("File src/lib/real-salons.ts updated successfully")

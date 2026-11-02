import { Injectable, NotFoundException } from "@nestjs/common";

export interface SalonRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  totalChairs: number;
  availableChairs: number;
  waitTimeMinutes: number;
  waitingCount: number;
  isVerified: boolean;
  services: Array<{ id: string; name: string; price: number; durationMinutes: number }>;
}

const BHUBANESWAR_SALONS: SalonRecord[] = [
  {
    id: "1",
    name: "Lakmé Salon — For Him and Her",
    slug: "lakme-salon-patia",
    category: "unisex",
    address: "1st Floor, Khata No. 474/156, Plot No. 435/1866, KIIT Road, opposite Manyavar, Patia",
    locality: "Patia & KIIT Square",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    latitude: 20.3548,
    longitude: 85.8193,
    contactPhone: "+919237362221",
    contactEmail: "lakmesalonindia1@gmail.com",
    rating: 4.8,
    reviewCount: 142,
    totalChairs: 4,
    availableChairs: 2,
    waitTimeMinutes: 8,
    waitingCount: 1,
    isVerified: true,
    services: [
      { id: "s-1", name: "Signature Haircut & Style", price: 200, durationMinutes: 30 },
      { id: "s-2", name: "Beard Sculpt & Shave", price: 120, durationMinutes: 15 },
      { id: "s-3", name: "Lakmé Radiance Skin Clean-up", price: 350, durationMinutes: 30 },
      { id: "s-4", name: "Organic Hair Spa Treatment", price: 650, durationMinutes: 45 },
    ],
  },
  {
    id: "2",
    name: "NVN Unisex Salon",
    slug: "nvn-unisex-salon",
    category: "unisex",
    address: "Plot No. 386, 1st Floor, Patia Square, Nandankanan Road, near Union Bank",
    locality: "Patia & KIIT Square",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    latitude: 20.3582,
    longitude: 85.8188,
    contactPhone: "+919337321880",
    website: "https://nvnsalon.com",
    rating: 4.7,
    reviewCount: 98,
    totalChairs: 3,
    availableChairs: 1,
    waitTimeMinutes: 12,
    waitingCount: 2,
    isVerified: true,
    services: [
      { id: "s-5", name: "Classic Scissor Cut & Finish", price: 180, durationMinutes: 30 },
      { id: "s-6", name: "Beard Shaping & Lineup", price: 100, durationMinutes: 15 },
      { id: "s-7", name: "Gel Nail Art & Polish", price: 400, durationMinutes: 45 },
    ],
  },
  {
    id: "3",
    name: "Green Trends Unisex Salon — Patia",
    slug: "green-trends-patia",
    category: "unisex",
    address: "1st Floor, D1 Square, Nandankanan Road, above Utkal Hyundai Showroom, Patia",
    locality: "Patia & KIIT Square",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    latitude: 20.3521,
    longitude: 85.8179,
    contactPhone: "+919861077886",
    rating: 4.6,
    reviewCount: 114,
    totalChairs: 3,
    availableChairs: 2,
    waitTimeMinutes: 5,
    waitingCount: 0,
    isVerified: true,
    services: [
      { id: "s-8", name: "Trends Signature Cut & Blowdry", price: 220, durationMinutes: 30 },
      { id: "s-9", name: "Organic Hair Spa Treatment", price: 600, durationMinutes: 40 },
    ],
  },
  {
    id: "4",
    name: "MMT Premium Unisex Salon",
    slug: "mmt-premium-salon",
    category: "unisex",
    address: "450/4507, 1st Floor, KIIT Road, opposite Bharat Petroleum, Patia",
    locality: "Patia & KIIT Square",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    latitude: 20.3534,
    longitude: 85.8185,
    contactPhone: "+919938833999",
    rating: 4.8,
    reviewCount: 76,
    totalChairs: 3,
    availableChairs: 2,
    waitTimeMinutes: 0,
    waitingCount: 0,
    isVerified: true,
    services: [
      { id: "s-10", name: "Executive Cut & Lineup", price: 250, durationMinutes: 30 },
      { id: "s-11", name: "Charcoal Detox Facial", price: 450, durationMinutes: 35 },
    ],
  },
  {
    id: "5",
    name: "Jawed Habib Hair & Beauty — Patia",
    slug: "jawed-habib-patia",
    category: "unisex",
    address: "Plot No. 516/1756, KIIT Road, near SBI ATM, Patia",
    locality: "Patia & KIIT Square",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    latitude: 20.3562,
    longitude: 85.8197,
    contactPhone: "+919438012345",
    rating: 4.5,
    reviewCount: 88,
    totalChairs: 4,
    availableChairs: 1,
    waitTimeMinutes: 18,
    waitingCount: 2,
    isVerified: true,
    services: [
      { id: "s-12", name: "Haircut by Senior Stylist", price: 199, durationMinutes: 30 },
      { id: "s-13", name: "Beard Trimming & Styling", price: 120, durationMinutes: 15 },
    ],
  },
  {
    id: "6",
    name: "Toni&Guy Essensuals — Chandrasekharpur",
    slug: "toni-and-guy-chandrasekharpur",
    category: "luxury",
    address: "District Centre, Niladri Vihar Road, Chandrasekharpur",
    locality: "Chandrasekharpur",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751023",
    latitude: 20.3341,
    longitude: 85.8211,
    contactPhone: "+919861234567",
    rating: 4.9,
    reviewCount: 165,
    totalChairs: 5,
    availableChairs: 3,
    waitTimeMinutes: 10,
    waitingCount: 1,
    isVerified: true,
    services: [
      { id: "s-14", name: "Creative Haircut & Finish", price: 450, durationMinutes: 45 },
      { id: "s-15", name: "Keratin Deep Repair Spa", price: 1200, durationMinutes: 60 },
    ],
  },
];

@Injectable()
export class SalonsService {
  async findAll(locality?: string, query?: string) {
    let result = BHUBANESWAR_SALONS;

    if (locality && locality !== "All") {
      result = result.filter(
        (s) =>
          s.locality.toLowerCase().includes(locality.toLowerCase()) ||
          s.address.toLowerCase().includes(locality.toLowerCase())
      );
    }

    if (query) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.services.some((svc) => svc.name.toLowerCase().includes(q))
      );
    }

    return result;
  }

  async findById(id: string) {
    const salon = BHUBANESWAR_SALONS.find((s) => s.id === id || s.slug === id);
    if (!salon) throw new NotFoundException(`Salon with ID or slug '${id}' not found`);
    return salon;
  }

  async registerSalon(dto: any) {
    const newId = String(BHUBANESWAR_SALONS.length + 1);
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newSalon: SalonRecord = {
      id: newId,
      name: dto.name,
      slug,
      category: dto.category || "unisex",
      address: dto.address,
      locality: dto.locality,
      city: dto.city || "Bhubaneswar",
      state: dto.state || "Odisha",
      pincode: dto.pincode,
      latitude: dto.latitude || 20.3548,
      longitude: dto.longitude || 85.8193,
      contactPhone: dto.contactPhone,
      contactEmail: dto.contactEmail,
      rating: 5.0,
      reviewCount: 0,
      totalChairs: dto.chairCount || 3,
      availableChairs: dto.chairCount || 3,
      waitTimeMinutes: 0,
      waitingCount: 0,
      isVerified: false,
      services: [
        { id: `s-${newId}-1`, name: "Standard Haircut", price: 200, durationMinutes: 30 },
        { id: `s-${newId}-2`, name: "Beard Grooming", price: 120, durationMinutes: 15 },
      ],
    };

    BHUBANESWAR_SALONS.push(newSalon);
    return {
      success: true,
      salonId: newId,
      slug,
      message: "Salon registration received. Application pending admin verification.",
    };
  }

  async submitClaim(claimDto: any) {
    const salon = await this.findById(claimDto.salonId);
    return {
      success: true,
      claimId: "clm-" + Date.now(),
      salonName: salon.name,
      status: "PENDING_VERIFICATION",
      message: "Salon ownership claim submitted. Snepr Admin will review business documentation.",
    };
  }
}

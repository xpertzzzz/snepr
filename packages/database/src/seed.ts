import { prisma } from "./client";
import {
  GlobalRole,
  MembershipRole,
  MembershipStatus,
  ChairStatus,
  QueueStatus,
  PlanTier,
  PaymentStatus,
} from "@snepr/shared-types";

// 13 Authoritative Bhubaneswar Salon Leads
const BHUBANESWAR_SEED_SALONS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    name: "Studio Eleven — Patia",
    slug: "studio-eleven-patia",
    category: "unisex",
    address: "Near Silicon Institute Road, Patia",
    locality: "Patia & KIIT Square",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751024",
    latitude: 20.3591,
    longitude: 85.8205,
    contactPhone: "+919337098765",
    rating: 4.6,
    reviewCount: 52,
    totalChairs: 3,
  },
  {
    name: "Mirrors Luxury Salon — Jayadev Vihar",
    slug: "mirrors-luxury-jayadev-vihar",
    category: "luxury",
    address: "Near Pal Heights Mall, Jayadev Vihar",
    locality: "Jayadev Vihar",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751013",
    latitude: 20.3015,
    longitude: 85.8239,
    contactPhone: "+919437112233",
    rating: 4.8,
    reviewCount: 130,
    totalChairs: 4,
  },
  {
    name: "Naturals Salon — Jayadev Vihar",
    slug: "naturals-jayadev-vihar",
    category: "unisex",
    address: "Opposite Biju Patnaik Park, Jayadev Vihar",
    locality: "Jayadev Vihar",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751013",
    latitude: 20.3032,
    longitude: 85.8214,
    contactPhone: "+919937223344",
    rating: 4.6,
    reviewCount: 92,
    totalChairs: 3,
  },
  {
    name: "7Sense Unisex Salon — Gajapati Nagar",
    slug: "7sense-gajapati-nagar",
    category: "unisex",
    address: "Plot No. 1731/1732, Gajapati Nagar, Press Chhak",
    locality: "Gajapati Nagar",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751005",
    latitude: 20.2978,
    longitude: 85.8351,
    contactPhone: "+919777889900",
    rating: 4.7,
    reviewCount: 81,
    totalChairs: 3,
  },
  {
    name: "Geetanjali Salon — Saheed Nagar",
    slug: "geetanjali-saheed-nagar",
    category: "luxury",
    address: "Plot No. 24, Janpath Road, Saheed Nagar",
    locality: "Saheed Nagar",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751007",
    latitude: 20.2894,
    longitude: 85.8442,
    contactPhone: "+919437998877",
    rating: 4.9,
    reviewCount: 178,
    totalChairs: 4,
  },
  {
    name: "Head Turners — Nayapalli",
    slug: "head-turners-nayapalli",
    category: "unisex",
    address: "VIP Area, IRC Village, Nayapalli",
    locality: "Nayapalli",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751015",
    latitude: 20.3072,
    longitude: 85.8085,
    contactPhone: "+919861445566",
    rating: 4.5,
    reviewCount: 64,
    totalChairs: 3,
  },
  {
    name: "Truefitt & Hill — Rasulgarh",
    slug: "truefitt-hill-rasulgarh",
    category: "luxury",
    address: "Esplanade One Mall, Rasulgarh",
    locality: "Rasulgarh",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751010",
    latitude: 20.2912,
    longitude: 85.8624,
    contactPhone: "+919937119988",
    rating: 4.9,
    reviewCount: 210,
    totalChairs: 4,
  },
];

const STANDARD_SERVICES = [
  { name: "Signature Haircut & Style", category: "Hair", price: 20000, durationMinutes: 30 },
  { name: "Beard Sculpt & Razor Finish", category: "Beard", price: 12000, durationMinutes: 15 },
  { name: "Hair Wash & Deep Conditioning", category: "Hair", price: 15000, durationMinutes: 20 },
  { name: "Charcoal Detox Facial", category: "Skin", price: 35000, durationMinutes: 30 },
  { name: "Organic Hair Spa Treatment", category: "Spa", price: 65000, durationMinutes: 45 },
];

export async function seedDatabase() {
  console.log("🌱 Starting Snepr PostgreSQL database seed...");

  // 1. Seed Demo Users
  const demoUsers = [
    {
      email: "customer@snepr.demo",
      name: "Ankit Mohapatra",
      phone: "+919876543210",
      globalRole: GlobalRole.CUSTOMER,
      pointsBalance: 120,
    },
    {
      email: "owner@snepr.demo",
      name: "Subrat Dash (Salon Partner)",
      phone: "+919237362221",
      globalRole: GlobalRole.CUSTOMER,
      pointsBalance: 50,
    },
    {
      email: "staff@snepr.demo",
      name: "Sameer Mohanty (Senior Stylist)",
      phone: "+919876543212",
      globalRole: GlobalRole.CUSTOMER,
      pointsBalance: 0,
    },
    {
      email: "admin@snepr.demo",
      name: "Snepr Admin Console",
      phone: "+919876543299",
      globalRole: GlobalRole.ADMIN,
      pointsBalance: 0,
    },
  ];

  const createdUsers: Record<string, any> = {};
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone, globalRole: u.globalRole },
      create: u,
    });
    createdUsers[u.email] = user;
    console.log(`  👤 Upserted user: ${u.email} (${u.globalRole})`);
  }

  // 2. Seed 13 Salons, Chairs & Services
  let primarySalonId: string | null = null;
  let chairOneId: string | null = null;

  for (let i = 0; i < BHUBANESWAR_SEED_SALONS.length; i++) {
    const data = BHUBANESWAR_SEED_SALONS[i];
    const salon = await prisma.salon.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        address: data.address,
        locality: data.locality,
        contactPhone: data.contactPhone,
        latitude: data.latitude,
        longitude: data.longitude,
        rating: data.rating,
        reviewCount: data.reviewCount,
      },
      create: {
        name: data.name,
        slug: data.slug,
        category: data.category,
        address: data.address,
        locality: data.locality,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude,
        longitude: data.longitude,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        website: data.website,
        rating: data.rating,
        reviewCount: data.reviewCount,
        isVerified: true,
        isActive: true,
      },
    });

    if (i === 0) primarySalonId = salon.id;

    // Seed Services for Salon
    for (const s of STANDARD_SERVICES) {
      await prisma.service.create({
        data: {
          salonId: salon.id,
          name: s.name,
          category: s.category,
          price: s.price,
          durationMinutes: s.durationMinutes,
        },
      });
    }

    // Seed Chairs for Salon
    for (let c = 1; c <= data.totalChairs; c++) {
      const chair = await prisma.chair.upsert({
        where: {
          salonId_chairNumber: {
            salonId: salon.id,
            chairNumber: c,
          },
        },
        update: {},
        create: {
          salonId: salon.id,
          chairNumber: c,
          name: `Chair 0${c}`,
          status: c === 1 ? ChairStatus.AVAILABLE : c === 2 ? ChairStatus.OCCUPIED : ChairStatus.AVAILABLE,
          currentEstimatedDurationMinutes: c === 2 ? 15 : undefined,
        },
      });
      if (i === 0 && c === 1) chairOneId = chair.id;
    }

    console.log(`  💈 Seeded salon: ${data.name} (${data.locality}) - ${data.totalChairs} chairs`);
  }

  // 3. Link Owner & Staff to Primary Salon (Lakmé Salon / The Groom Room)
  if (primarySalonId) {
    // Assign Owner
    await prisma.salonMember.upsert({
      where: {
        userId_salonId: {
          userId: createdUsers["owner@snepr.demo"].id,
          salonId: primarySalonId,
        },
      },
      update: { role: MembershipRole.OWNER, status: MembershipStatus.ACTIVE },
      create: {
        userId: createdUsers["owner@snepr.demo"].id,
        salonId: primarySalonId,
        role: MembershipRole.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    });

    // Assign Staff to Chair 01
    await prisma.salonMember.upsert({
      where: {
        userId_salonId: {
          userId: createdUsers["staff@snepr.demo"].id,
          salonId: primarySalonId,
        },
      },
      update: {
        role: MembershipRole.STAFF,
        status: MembershipStatus.ACTIVE,
        assignedChairId: chairOneId || undefined,
      },
      create: {
        userId: createdUsers["staff@snepr.demo"].id,
        salonId: primarySalonId,
        role: MembershipRole.STAFF,
        status: MembershipStatus.ACTIVE,
        assignedChairId: chairOneId || undefined,
      },
    });

    // Create Intermediate Subscription for primary salon
    await prisma.subscription.create({
      data: {
        salonId: primarySalonId,
        tier: PlanTier.INTERMEDIATE_400,
        amount: 400,
        status: PaymentStatus.PAID,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Create an active demo queue token for customer
    await prisma.queueToken.create({
      data: {
        tokenNumber: 14,
        tokenDisplay: "A-14",
        salonId: primarySalonId,
        customerId: createdUsers["customer@snepr.demo"].id,
        customerName: createdUsers["customer@snepr.demo"].name || "Ankit Mohapatra",
        customerPhone: "+919876543210",
        status: QueueStatus.WAITING,
        serviceIds: [],
        totalPrice: 20000,
        estimatedWaitMinutes: 8,
        assignedChairId: chairOneId || undefined,
      },
    });

    console.log(`  ⭐ Linked demo owner & staff memberships and active queue token for primary salon.`);
  }

  console.log("✅ Snepr database seed completed successfully.");
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  seedDatabase()
    .catch((err) => {
      console.error("❌ Seed error:", err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}

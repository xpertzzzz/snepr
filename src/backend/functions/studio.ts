import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { salons, services, queues } from "../db/schema";
import { eq, and, ilike, or } from "drizzle-orm";

export interface StudioHairstyle {
  id: string;
  title: string;
  gender: "men" | "women" | "kids";
  category: "classic" | "trend" | "aesthetic" | "color" | "protective";
  length: "buzz" | "short" | "medium" | "long";
  texture: "straight" | "wavy" | "curly" | "coily" | "all";
  aesthetic: string;
  maintenanceTime: "low (< 5m)" | "medium (10-15m)" | "high (20m+)";
  beardCompatible?: boolean;
  guardianAware?: boolean;
  matchedServiceName: string;
  description: string;
  tags: string[];
}

export const CURATED_CATALOGUE: StudioHairstyle[] = [
  // ─── MEN'S COLLECTIONS (STRATEGY REPORT SECTION 7) ───
  {
    id: "men-textured-crop",
    title: "Modern Textured French Crop",
    gender: "men",
    category: "trend",
    length: "short",
    texture: "straight",
    aesthetic: "Clean / Minimal",
    maintenanceTime: "low (< 5m)",
    beardCompatible: true,
    matchedServiceName: "Haircut & Styling",
    description: "Short blunt fringe with textured crown layers and low drop fade. Effortless styling with matte clay.",
    tags: ["French Crop", "Textured", "Drop Fade", "CEO"],
  },
  {
    id: "men-old-money-quiff",
    title: "Old Money Executive Quiff",
    gender: "men",
    category: "classic",
    length: "medium",
    texture: "wavy",
    aesthetic: "Old Money / Quiet Luxury",
    maintenanceTime: "medium (10-15m)",
    beardCompatible: true,
    matchedServiceName: "Haircut & Styling",
    description: "Classic soft-taper sides with natural volume swept back. Polished, distinguished aesthetic.",
    tags: ["Quiff", "Taper", "Old Money", "Executive"],
  },
  {
    id: "men-modern-wolf-cut",
    title: "Urban Shaggy Wolf Cut",
    gender: "men",
    category: "trend",
    length: "medium",
    texture: "wavy",
    aesthetic: "Celebrity / Rugged",
    maintenanceTime: "medium (10-15m)",
    beardCompatible: true,
    matchedServiceName: "Haircut & Styling",
    description: "Choppy layered cut combining shag and mullet silhouette with soft curtains and face framing.",
    tags: ["Wolf Cut", "Mullet", "Curtains", "Trend"],
  },
  {
    id: "men-taper-fade-beard",
    title: "Sharp Taper Fade + Sculpted Beard",
    gender: "men",
    category: "classic",
    length: "short",
    texture: "curly",
    aesthetic: "Mafia-inspired / Rugged",
    maintenanceTime: "low (< 5m)",
    beardCompatible: true,
    matchedServiceName: "Beard Trim",
    description: "Zero skin taper on temples and neckline blending flawlessly into a precision line-up beard.",
    tags: ["Taper Fade", "Line-up", "Beard Sculpt", "Sharp"],
  },
  {
    id: "men-buzz-fade",
    title: "Military Precision Buzz Fade",
    gender: "men",
    category: "classic",
    length: "buzz",
    texture: "all",
    aesthetic: "Clean / Minimal",
    maintenanceTime: "low (< 5m)",
    beardCompatible: true,
    matchedServiceName: "Haircut & Styling",
    description: "Ultra-short uniform top with sharp high-and-tight skin fade. Zero morning maintenance.",
    tags: ["Buzz Cut", "Skin Fade", "Minimal", "Low Maintenance"],
  },

  // ─── WOMEN'S COLLECTIONS (STRATEGY REPORT SECTION 7) ───
  {
    id: "women-butterfly-cut",
    title: "Voluminous Butterfly Layered Cut",
    gender: "women",
    category: "trend",
    length: "long",
    texture: "wavy",
    aesthetic: "Glamour / Quiet Luxury",
    maintenanceTime: "medium (10-15m)",
    matchedServiceName: "Haircut & Styling",
    description: "Dynamic dual-layer cut giving the illusion of short volume on top with cascading long bottom layers.",
    tags: ["Butterfly Cut", "Layers", "Blowing Volume", "Glamour"],
  },
  {
    id: "women-korean-curtain-bob",
    title: "Korean Soft Curtain Bob",
    gender: "women",
    category: "aesthetic",
    length: "short",
    texture: "straight",
    aesthetic: "Korean / K-Drama",
    maintenanceTime: "low (< 5m)",
    matchedServiceName: "Haircut & Styling",
    description: "Airy chin-length French bob featuring transparent wispy curtain bangs that frame the cheekbones.",
    tags: ["Bob", "K-Drama", "Curtain Bangs", "Airy"],
  },
  {
    id: "women-balayage-caramel",
    title: "Caramel Sun-Kissed Balayage",
    gender: "women",
    category: "color",
    length: "medium",
    texture: "wavy",
    aesthetic: "Old Money / Quiet Luxury",
    maintenanceTime: "medium (10-15m)",
    matchedServiceName: "Hair Spa",
    description: "Hand-painted warm caramel and honey tones melting smoothly over rich espresso brown roots.",
    tags: ["Balayage", "Caramel", "Highlights", "Hair Color"],
  },
  {
    id: "women-femme-fatale-lob",
    title: "Femme Fatale Blunt Lob",
    gender: "women",
    category: "aesthetic",
    length: "medium",
    texture: "straight",
    aesthetic: "Mafia / Femme Fatale",
    maintenanceTime: "medium (10-15m)",
    matchedServiceName: "Haircut & Styling",
    description: "Razor-sharp collarbone-length blunt lob with high-gloss mirror shine. Sleek, powerful, and commanding.",
    tags: ["Blunt Lob", "Gloss", "Femme Fatale", "CEO"],
  },

  // ─── KIDS' COLLECTIONS (STRATEGY REPORT SECTION 7: GUARDIAN AWARE) ───
  {
    id: "kids-textured-crew",
    title: "Active Taper & Textured Fringe",
    gender: "kids",
    category: "classic",
    length: "short",
    texture: "all",
    aesthetic: "Clean / Minimal",
    maintenanceTime: "low (< 5m)",
    guardianAware: true,
    matchedServiceName: "Haircut & Styling",
    description: "Practical, kid-friendly short cut with soft taper. Easy for school and sports with zero products needed.",
    tags: ["Kids Cut", "Taper", "School Friendly", "No Perms"],
  },
  {
    id: "kids-natural-curl-bob",
    title: "Bouncy Natural Curls Bob",
    gender: "kids",
    category: "trend",
    length: "short",
    texture: "curly",
    aesthetic: "Clean / Minimal",
    maintenanceTime: "low (< 5m)",
    guardianAware: true,
    matchedServiceName: "Haircut & Styling",
    description: "Gentle round layering that enhances natural curl patterns without heat or harsh chemicals.",
    tags: ["Natural Curls", "Kids Bob", "Guardian Aware", "Safe"],
  },
];

// ─── Get Studio Catalogue with Filters ───────────────────────────────────────

export const getStudioCatalogue = createServerFn({ method: "GET" })
  .validator((filters?: {
    gender?: "men" | "women" | "kids";
    category?: string;
    length?: string;
    aesthetic?: string;
    search?: string;
  }) => filters)
  .handler(async ({ data: filters }) => {
    let results = CURATED_CATALOGUE;

    if (filters?.gender) {
      results = results.filter((item) => item.gender === filters.gender);
    }
    if (filters?.category && filters.category !== "all") {
      results = results.filter((item) => item.category === filters.category);
    }
    if (filters?.length && filters.length !== "all") {
      results = results.filter((item) => item.length === filters.length);
    }
    if (filters?.aesthetic && filters.aesthetic !== "all") {
      results = results.filter((item) => item.aesthetic.includes(filters.aesthetic!));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  });

// ─── Find Salons Providing Look Services (Direct Queue Connection) ───────────

export const findSalonsForStyle = createServerFn({ method: "GET" })
  .validator((d: { matchedServiceName: string }) => d)
  .handler(async ({ data }) => {
    // Find all salons with matching services
    const matchedServices = await db
      .select({
        salonId: services.salonId,
        serviceName: services.name,
        pricePaise: services.price,
        durationMins: services.durationMins,
      })
      .from(services)
      .where(ilike(services.name, `%${data.matchedServiceName.split(" ")[0]}%`));

    const salonIds = Array.from(new Set(matchedServices.map((s) => s.salonId)));
    if (salonIds.length === 0) {
      // Fallback: return top open salons
      const fallbackSalons = await db.select().from(salons).limit(5);
      return fallbackSalons.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        rating: s.rating,
        matchedService: "Haircut & Styling",
        priceRs: 250,
        waitTimeMins: 15,
        waitingCount: 1,
      }));
    }

    const matchedSalons = await Promise.all(
      salonIds.map(async (sId) => {
        const [salon] = await db.select().from(salons).where(eq(salons.id, sId));
        if (!salon) return null;
        const waiting = await db
          .select()
          .from(queues)
          .where(and(eq(queues.salonId, sId), eq(queues.status, "waiting")));

        const serviceInfo = matchedServices.find((s) => s.salonId === sId);

        return {
          id: salon.id,
          name: salon.name,
          address: salon.address,
          rating: salon.rating,
          matchedService: serviceInfo?.serviceName || "Haircut & Styling",
          priceRs: Math.round((serviceInfo?.pricePaise || 25000) / 100),
          waitTimeMins: waiting.length * 15,
          waitingCount: waiting.length,
        };
      })
    );

    return matchedSalons.filter(Boolean) as {
      id: number;
      name: string;
      address: string | null;
      rating: string | null;
      matchedService: string;
      priceRs: number;
      waitTimeMins: number;
      waitingCount: number;
    }[];
  });

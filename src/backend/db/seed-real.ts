import { db, connection } from "./index";
import { cities, areas, salons, chairs, queues } from "./schema";
import { REAL_SALONS_DATA, BHUBANESWAR_AREAS, CITIES } from "../../lib/real-salons";
import { eq, notInArray } from "drizzle-orm";

async function seedRealData() {
  console.log("Seeding verified Bhubaneswar Salon Leads (13 Salons across 4 Areas)...");

  // 1. Seed Cities
  for (const c of CITIES) {
    try {
      await db.insert(cities).values({
        id: c.id,
        name: c.name,
        state: c.state,
        slug: c.slug,
        isActive: c.isActive,
      }).onConflictDoNothing();
    } catch {}
  }

  // 2. Seed Areas
  for (const a of BHUBANESWAR_AREAS) {
    try {
      await db.insert(areas).values({
        id: a.id,
        cityId: a.cityId,
        name: a.name,
        slug: a.slug,
        isActive: a.isActive,
        displayOrder: a.displayOrder,
      }).onConflictDoNothing();
    } catch {}
  }

  // 3. Seed Verified Salons
  const seededIds: number[] = [];
  for (const s of REAL_SALONS_DATA) {
    seededIds.push(s.id);
    try {
      const existing = await db.select().from(salons).where(eq(salons.id, s.id));
      if (existing.length > 0) {
        await db.update(salons).set({
          name: s.name,
          slug: s.slug,
          areaId: s.areaId,
          cityId: s.cityId,
          address: s.address,
          phone: s.phone,
          email: s.email,
          category: s.category,
          rating: s.rating,
          reviewCount: s.reviewCount,
          verificationStatus: s.verificationStatus,
          operationalStatus: s.operationalStatus,
          status: "open",
          approvalStatus: "approved",
        }).where(eq(salons.id, s.id));
      } else {
        await db.insert(salons).values({
          id: s.id,
          name: s.name,
          slug: s.slug,
          areaId: s.areaId,
          cityId: s.cityId,
          address: s.address,
          phone: s.phone,
          email: s.email,
          category: s.category,
          rating: s.rating,
          reviewCount: s.reviewCount,
          verificationStatus: s.verificationStatus,
          operationalStatus: s.operationalStatus,
          status: "open",
          approvalStatus: "approved",
        });
      }

      // Seed chairs for this salon
      for (const ch of s.chairs) {
        try {
          await db.insert(chairs).values({
            id: ch.id,
            salonId: s.id,
            chairNumber: ch.chairNumber,
            name: ch.name,
            status: ch.status,
          }).onConflictDoNothing();
        } catch {}
      }
    } catch (e) {
      console.error(`Failed to upsert salon ${s.name}:`, e);
    }
  }

  // 4. Remove fake / non-verified salons
  try {
    if (seededIds.length > 0) {
      await db.delete(salons).where(notInArray(salons.id, seededIds));
      console.log("Cleaned up unverified/legacy salons from database.");
    }
  } catch (e) {
    console.warn("Could not delete non-matching salons:", e);
  }

  // 5. Seed sample live queue tokens for Lakmé Salon & NVN Unisex Salon
  try {
    await db.insert(queues).values([
      { salonId: 1, tokenNumber: 101, status: "completed" },
      { salonId: 1, tokenNumber: 102, status: "in-progress" },
      { salonId: 1, tokenNumber: 103, status: "waiting" },
      { salonId: 2, tokenNumber: 201, status: "completed" },
      { salonId: 2, tokenNumber: 202, status: "in-progress" },
      { salonId: 2, tokenNumber: 203, status: "waiting" },
    ]).onConflictDoNothing();
  } catch {}

  console.log(`Successfully synced ${REAL_SALONS_DATA.length} verified salons across 4 Bhubaneswar areas!`);
  if (connection && typeof connection.end === "function") {
    await connection.end();
  }
}

seedRealData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

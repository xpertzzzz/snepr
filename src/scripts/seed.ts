/*
 * seed.ts — Snepr database seeder & cleanup
 * Run with: npx tsx src/scripts/seed.ts
 */
import { db } from "../backend/db";
import * as schema from "../backend/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { REAL_SALONS_DATA, BHUBANESWAR_AREAS, CITIES } from "../lib/real-salons";

async function seed() {
  console.log("🌱 Seeding & cleaning up Snepr database…\n");

  // ── 1. Clean up legacy admin users, keeping only snepr@2026 ─────────────────
  console.log("→ Cleaning up extra admin users…");

  await db.delete(schema.users)
    .where(
      sql`${schema.users.username} IN ('admin', 'subadmin') AND ${schema.users.username} != 'snepr@2026'`
    );

  const hashed = await bcrypt.hash("sn#admin!epr@", 12);

  // Upsert snepr@2026 as superior super_admin
  const existingSuper = await db.select().from(schema.users)
    .where(eq(schema.users.username, "snepr@2026"));

  if (existingSuper.length > 0) {
    await db.update(schema.users)
      .set({
        name: "Snepr Super Admin",
        role: "super_admin",
        password: hashed,
        suspendedAt: null,
      })
      .where(eq(schema.users.username, "snepr@2026"));
    console.log("   ✓ Primary Super Admin (snepr@2026) synced & active.");
  } else {
    await db.insert(schema.users).values({
      username: "snepr@2026",
      password: hashed,
      name: "Snepr Super Admin",
      role: "super_admin",
    });
    console.log("   ✓ Primary Super Admin (snepr@2026) created.");
  }

  // ── 2. Seed cities ────────────────────────────────────────────────────────
  console.log("\n→ Seeding cities…");
  for (const city of CITIES) {
    await db.insert(schema.cities).values({
      id: city.id,
      name: city.name,
      state: city.state,
      slug: city.slug,
      isActive: city.isActive,
    }).onConflictDoNothing();
    console.log(`   ✓ ${city.name}, ${city.state}`);
  }

  // ── 3. Seed areas ─────────────────────────────────────────────────────────
  console.log("\n→ Seeding Bhubaneswar areas…");
  for (const area of BHUBANESWAR_AREAS) {
    await db.insert(schema.areas).values({
      id: area.id,
      cityId: area.cityId,
      name: area.name,
      slug: area.slug,
      isActive: area.isActive,
      displayOrder: area.displayOrder,
    }).onConflictDoNothing();
    console.log(`   ✓ #${area.displayOrder} ${area.name}`);
  }

  // ── 4. Seed verified Salons ───────────────────────────────────────────────
  console.log("\n→ Seeding 13 verified Bhubaneswar salon leads…");
  for (const s of REAL_SALONS_DATA) {
    const existing = await db.select().from(schema.salons).where(eq(schema.salons.id, s.id));
    if (existing.length > 0) {
      await db.update(schema.salons).set({
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
      }).where(eq(schema.salons.id, s.id));
    } else {
      await db.insert(schema.salons).values({
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
    console.log(`   ✓ [${s.areaName}] ${s.name}`);
  }

  console.log("\n✅ Database clean & synced with verified salon leads!\n");
  console.log("─────────────────────────────────────────");
  console.log("  Portal:   https://snepr.in/admin");
  console.log("  Username: snepr@2026");
  console.log("  Password: sn#admin!epr@");
  console.log("─────────────────────────────────────────\n");

  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});

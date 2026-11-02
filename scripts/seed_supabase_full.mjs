import postgres from "postgres";
import bcrypt from "bcryptjs";
import { REAL_SALONS_DATA, BHUBANESWAR_AREAS, CITIES } from "../src/lib/real-salons.ts";

const connStr = "postgresql://postgres:Q6Dlial198lVgsQz@db.becpnekqqkgjopjzemtt.supabase.co:5432/postgres?sslmode=require";

async function seed() {
  console.log("Connecting to Supabase PostgreSQL at becpnekqqkgjopjzemtt.supabase.co...");
  const sql = postgres(connStr, { prepare: false });

  try {
    // 0. Ensure schema compatibility for chairs
    console.log("Ensuring schema compatibility...");
    await sql`ALTER TABLE chairs ADD COLUMN IF NOT EXISTS barber_name TEXT`;
    await sql`ALTER TABLE chairs ADD COLUMN IF NOT EXISTS current_service TEXT`;
    await sql`ALTER TABLE chairs ADD COLUMN IF NOT EXISTS current_token TEXT`;
    await sql`ALTER TABLE chairs ADD COLUMN IF NOT EXISTS service_minutes_left INTEGER DEFAULT 0`;
    console.log("  ✓ Chairs table schema updated.");

    // 1. Seed Cities
    console.log("Seeding Cities...");
    for (const c of CITIES) {
      await sql`
        INSERT INTO cities (id, name, state, slug, country, is_active)
        VALUES (${c.id}, ${c.name}, ${c.state}, ${c.slug}, 'India', ${c.isActive})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          state = EXCLUDED.state,
          slug = EXCLUDED.slug,
          is_active = EXCLUDED.is_active
      `;
    }
    console.log(`  ✓ ${CITIES.length} cities seeded.`);

    // 2. Seed Areas
    console.log("Seeding Areas...");
    for (const a of BHUBANESWAR_AREAS) {
      await sql`
        INSERT INTO areas (id, city_id, name, slug, is_active, display_order)
        VALUES (${a.id}, ${a.cityId}, ${a.name}, ${a.slug}, ${a.isActive}, ${a.displayOrder})
        ON CONFLICT (id) DO UPDATE SET
          city_id = EXCLUDED.city_id,
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          is_active = EXCLUDED.is_active,
          display_order = EXCLUDED.display_order
      `;
    }
    console.log(`  ✓ ${BHUBANESWAR_AREAS.length} areas seeded.`);

    // 3. Seed Users
    console.log("Seeding Sample Users (Admin, Owner, Staff, Customer)...");
    const samplePassword = "Password@123";
    const hashedPassword = await bcrypt.hash(samplePassword, 10);

    const sampleUsers = [
      {
        id: 1,
        username: "admin",
        email: "admin@snepr.com",
        name: "Snepr Super Admin",
        role: "super_admin",
        phone: "+91 99999 00001",
        salon_id: null,
      },
      {
        id: 2,
        username: "salon_owner",
        email: "owner@snepr.com",
        name: "Arjun Sharma (Salon Owner)",
        role: "salon_owner",
        phone: "+91 92373 62221",
        salon_id: 1,
      },
      {
        id: 3,
        username: "barber_prakash",
        email: "staff@snepr.com",
        name: "Prakash Jena (Senior Stylist)",
        role: "staff",
        phone: "+91 92373 62222",
        salon_id: 1,
      },
      {
        id: 4,
        username: "customer_rohan",
        email: "customer@snepr.com",
        name: "Rohan Dash",
        role: "customer",
        phone: "+91 98765 43210",
        salon_id: null,
      },
      {
        id: 5,
        username: "xpertenzo_admin",
        email: "xpertenzo.in@gmail.com",
        name: "Ankit Admin",
        role: "super_admin",
        phone: "+91 92373 62220",
        salon_id: null,
      }
    ];

    for (const u of sampleUsers) {
      await sql`
        INSERT INTO users (id, username, password, name, email, phone, role, salon_id)
        VALUES (${u.id}, ${u.username}, ${hashedPassword}, ${u.name}, ${u.email}, ${u.phone}, ${u.role}, ${u.salon_id})
        ON CONFLICT (id) DO UPDATE SET
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          role = EXCLUDED.role,
          salon_id = EXCLUDED.salon_id
      `;
    }
    await sql`SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))`;
    console.log(`  ✓ ${sampleUsers.length} users seeded in public.users.`);

    // 4. Seed Supabase auth.users
    console.log("Synchronizing Supabase auth.users...");
    for (const u of sampleUsers) {
      try {
        const [existing] = await sql`SELECT id FROM auth.users WHERE email = ${u.email}`;
        if (!existing) {
          const appMeta = JSON.stringify({ provider: "email", providers: ["email"] });
          const userMeta = JSON.stringify({ name: u.name, role: u.role, username: u.username });
          await sql`
            INSERT INTO auth.users (
              instance_id,
              id,
              aud,
              role,
              email,
              encrypted_password,
              email_confirmed_at,
              raw_app_meta_data,
              raw_user_meta_data,
              created_at,
              updated_at,
              phone
            )
            VALUES (
              '00000000-0000-0000-0000-000000000000',
              gen_random_uuid(),
              'authenticated',
              'authenticated',
              ${u.email},
              ${hashedPassword},
              NOW(),
              ${appMeta}::jsonb,
              ${userMeta}::jsonb,
              NOW(),
              NOW(),
              ${u.phone}
            )
          `;
        } else {
          const userMeta = JSON.stringify({ name: u.name, role: u.role, username: u.username });
          await sql`
            UPDATE auth.users SET
              encrypted_password = ${hashedPassword},
              email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
              raw_user_meta_data = ${userMeta}::jsonb
            WHERE email = ${u.email}
          `;
        }
      } catch (authErr) {
        console.warn(`  Warning seeding auth.users for ${u.email}:`, authErr.message);
      }
    }
    console.log("  ✓ auth.users synchronized with Supabase Auth.");

    // 5. Seed Salons
    console.log("Seeding 16 Verified Salons...");
    for (const s of REAL_SALONS_DATA) {
      await sql`
        INSERT INTO salons (
          id, name, slug, area_id, address, city_id, phone, email, category, rating,
          review_count, owner_id, verification_status, operational_status, approval_status,
          status, location
        )
        VALUES (
          ${s.id}, ${s.name}, ${s.slug}, ${s.areaId}, ${s.address}, ${s.cityId},
          ${s.phone || null}, ${s.email || null}, ${s.category}, ${s.rating},
          ${s.reviewCount}, 2, ${s.verificationStatus}, ${s.operationalStatus}, 'approved',
          'open', ${s.areaName}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          area_id = EXCLUDED.area_id,
          address = EXCLUDED.address,
          city_id = EXCLUDED.city_id,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          category = EXCLUDED.category,
          rating = EXCLUDED.rating,
          review_count = EXCLUDED.review_count,
          verification_status = EXCLUDED.verification_status,
          operational_status = EXCLUDED.operational_status,
          approval_status = EXCLUDED.approval_status,
          status = EXCLUDED.status
      `;
    }
    await sql`SELECT setval('salons_id_seq', (SELECT MAX(id) FROM salons))`;
    console.log(`  ✓ ${REAL_SALONS_DATA.length} salons seeded.`);

    // 6. Seed Chairs
    console.log("Seeding Chairs...");
    let chairCount = 0;
    for (const s of REAL_SALONS_DATA) {
      if (s.chairs && s.chairs.length > 0) {
        for (const ch of s.chairs) {
          chairCount++;
          await sql`
            INSERT INTO chairs (
              id, salon_id, chair_number, name, barber_name, status,
              current_service, current_token, service_minutes_left
            )
            VALUES (
              ${ch.id}, ${ch.salonId}, ${ch.chairNumber}, ${ch.name}, ${ch.barberName},
              ${ch.status}, ${ch.currentService || null}, ${ch.currentToken || null},
              ${ch.serviceMinutesLeft || 0}
            )
            ON CONFLICT (id) DO UPDATE SET
              salon_id = EXCLUDED.salon_id,
              chair_number = EXCLUDED.chair_number,
              name = EXCLUDED.name,
              barber_name = EXCLUDED.barber_name,
              status = EXCLUDED.status,
              current_service = EXCLUDED.current_service,
              current_token = EXCLUDED.current_token,
              service_minutes_left = EXCLUDED.service_minutes_left
          `;
        }
      }
    }
    try {
      await sql`SELECT setval('chairs_id_seq', (SELECT MAX(id) FROM chairs))`;
    } catch {}
    console.log(`  ✓ ${chairCount} chairs seeded.`);

    // 7. Seed Services
    console.log("Seeding Services...");
    let serviceCount = 0;
    for (const s of REAL_SALONS_DATA) {
      if (s.services && s.services.length > 0) {
        for (const srv of s.services) {
          serviceCount++;
          await sql`
            INSERT INTO services (
              id, salon_id, name, price, duration_mins, is_active, discount_percent
            )
            VALUES (
              ${srv.id}, ${s.id}, ${srv.name}, ${srv.price}, ${srv.durationMins}, true, ${srv.discountPercent || 0}
            )
            ON CONFLICT (id) DO UPDATE SET
              salon_id = EXCLUDED.salon_id,
              name = EXCLUDED.name,
              price = EXCLUDED.price,
              duration_mins = EXCLUDED.duration_mins,
              is_active = EXCLUDED.is_active
          `;
        }
      }
    }
    try {
      await sql`SELECT setval('services_id_seq', (SELECT MAX(id) FROM services))`;
    } catch {}
    console.log(`  ✓ ${serviceCount} services seeded.`);

    // 8. Seed Sample Queues
    console.log("Seeding Sample Queues...");
    await sql`
      INSERT INTO queues (id, salon_id, customer_id, token_number, status, estimated_wait_mins, created_at)
      VALUES 
        (1, 1, 4, 107, 'waiting', 12, NOW()),
        (2, 1, 4, 108, 'waiting', 18, NOW()),
        (3, 14, 4, 7, 'waiting', 5, NOW())
      ON CONFLICT (id) DO UPDATE SET
        salon_id = EXCLUDED.salon_id,
        customer_id = EXCLUDED.customer_id,
        token_number = EXCLUDED.token_number,
        status = EXCLUDED.status,
        estimated_wait_mins = EXCLUDED.estimated_wait_mins
    `;
    try {
      await sql`SELECT setval('queues_id_seq', (SELECT MAX(id) FROM queues))`;
    } catch {}
    console.log("  ✓ Sample queues seeded.");

    // 9. Seed Snepr Points Ledger
    console.log("Seeding Loyalty Points Ledger...");
    await sql`
      INSERT INTO snepr_points_ledger (id, user_id, salon_id, points, event_type, description, created_at)
      VALUES 
        (1, 4, 1, 50, 'completed_service', 'Completed Precision Haircut at Lakmé Salon', NOW() - INTERVAL '5 days'),
        (2, 4, 1, 20, 'verified_review', 'Verified review with 5 stars for Stylist Priyanka', NOW() - INTERVAL '5 days'),
        (3, 4, 14, 15, 'completed_service', 'Completed Fade and Beard Sculpt at The Scissors Edge', NOW() - INTERVAL '1 day')
      ON CONFLICT (id) DO UPDATE SET
        points = EXCLUDED.points,
        event_type = EXCLUDED.event_type,
        description = EXCLUDED.description
    `;
    try {
      await sql`SELECT setval('snepr_points_ledger_id_seq', (SELECT MAX(id) FROM snepr_points_ledger))`;
    } catch {}
    console.log("  ✓ Loyalty points ledger seeded (85 points for customer).");

    console.log("\n=======================================================");
    console.log("ALL SUPABASE DATABASE TABLES AND SAMPLE CREDENTIALS CREATED!");
    console.log("=======================================================");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await sql.end();
  }
}

seed();

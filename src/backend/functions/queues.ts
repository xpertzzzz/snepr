import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { queues, staff, bookings } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { recordPointsTransaction } from "./points";

// ─── Get a single queue entry by ID (for token polling) ──────────────────────

export const getQueueStatus = createServerFn({ method: "GET" })
  .validator((d: number) => d)
  .handler(async ({ data: queueId }) => {
    const result = await db.select().from(queues).where(eq(queues.id, queueId));
    return result[0] ?? null;
  });

// ─── Get live queue for a salon ───────────────────────────────────────────────

export const getLiveQueue = createServerFn({ method: "GET" })
  .validator((d: { salonId: number }) => d)
  .handler(async ({ data }) => {
    return db.select().from(queues)
      .where(and(
        eq(queues.salonId, data.salonId),
        eq(queues.status, "waiting")
      ));
  });

// ─── Join queue (Customer) ────────────────────────────────────────────────────

export const joinQueue = createServerFn({ method: "POST" })
  .validator((d: { salonId: number; customerId?: number; serviceId?: number; staffId?: number }) => d)
  .handler(async ({ data }) => {
    // Calculate next token number safely
    const allTokens = await db.select().from(queues).where(eq(queues.salonId, data.salonId));
    const maxToken = allTokens.reduce((max, item) => Math.max(max, item.tokenNumber), 100);
    const tokenNumber = maxToken + 1;

    const waiting = allTokens.filter(t => t.status === "waiting");
    const estimatedWaitMins = Math.max((waiting.length + 1) * 15, 10);

    const [entry] = await db.insert(queues).values({
      salonId: data.salonId,
      customerId: data.customerId ?? null,
      serviceId: data.serviceId ?? null,
      staffId: data.staffId ?? null,
      tokenNumber,
      status: "waiting",
      estimatedWaitMins,
    }).returning();

    return entry;
  });

// ─── Cancel queue token ───────────────────────────────────────────────────────

export const cancelQueueToken = createServerFn({ method: "POST" })
  .validator((d: { queueId: number; reason?: string }) => d)
  .handler(async ({ data }) => {
    const [updated] = await db.update(queues)
      .set({ status: "cancelled" })
      .where(eq(queues.id, data.queueId))
      .returning();
    return updated;
  });

// ─── Call next customer (Salon Owner / Staff) ─────────────────────────────────

export const callNext = createServerFn({ method: "POST" })
  .validator((d: { callerRole: string; salonId: number }) => d)
  .handler(async ({ data }) => {
    if (!["super_admin", "sub_admin", "salon_owner", "staff"].includes(data.callerRole)) {
      throw new Error("Forbidden");
    }

    const waiting = await db.select().from(queues)
      .where(and(eq(queues.salonId, data.salonId), eq(queues.status, "waiting")));

    const next = waiting.sort((a, b) => a.tokenNumber - b.tokenNumber)[0];
    if (!next) throw new Error("No customers in queue");

    const [updated] = await db.update(queues)
      .set({ status: "in-progress", calledAt: new Date() })
      .where(eq(queues.id, next.id))
      .returning();

    return updated;
  });

// ─── Skip customer ─────────────────────────────────────────────────────────────

export const skipCustomer = createServerFn({ method: "POST" })
  .validator((d: { callerRole: string; queueId: number }) => d)
  .handler(async ({ data }) => {
    if (!["super_admin", "sub_admin", "salon_owner", "staff"].includes(data.callerRole)) {
      throw new Error("Forbidden");
    }
    const [updated] = await db.update(queues)
      .set({ status: "skipped" })
      .where(eq(queues.id, data.queueId))
      .returning();
    return updated;
  });

// ─── Complete service ─────────────────────────────────────────────────────────

export const completeService = createServerFn({ method: "POST" })
  .validator((d: { callerRole: string; queueId: number }) => d)
  .handler(async ({ data }) => {
    if (!["super_admin", "sub_admin", "salon_owner", "staff"].includes(data.callerRole)) {
      throw new Error("Forbidden");
    }
    const [updated] = await db.update(queues)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(queues.id, data.queueId))
      .returning();

    // Auto-award +5 Snepr Points if customer is registered (Strategy Report Section 10)
    if (updated && updated.customerId) {
      try {
        await recordPointsTransaction({
          userId: updated.customerId,
          salonId: updated.salonId,
          queueId: updated.id,
          points: 5,
          eventType: "completed_service",
          description: `Earned +5 Snepr Points for completed salon service (Token #${updated.tokenNumber})`,
        });
      } catch (err) {
        console.error("Auto points error:", err);
      }
    }

    return updated;
  });

// ─── Staff management ─────────────────────────────────────────────────────────

export const getStaff = createServerFn({ method: "GET" })
  .validator((d: { salonId: number }) => d)
  .handler(async ({ data }) => {
    return db.select({
      id: staff.id,
      salonId: staff.salonId,
      userId: staff.userId,
      role: staff.role,
      breakMode: staff.breakMode,
      leaveAt: staff.leaveAt,
      createdAt: staff.createdAt,
    }).from(staff).where(eq(staff.salonId, data.salonId));
  });

export const addStaff = createServerFn({ method: "POST" })
  .validator((d: { callerRole: string; salonId: number; userId: number; role: string }) => d)
  .handler(async ({ data }) => {
    if (!["super_admin", "salon_owner"].includes(data.callerRole)) throw new Error("Forbidden");
    const [member] = await db.insert(staff).values({
      salonId: data.salonId,
      userId: data.userId,
      role: data.role,
    }).returning({
      id: staff.id,
      salonId: staff.salonId,
      userId: staff.userId,
      role: staff.role,
      breakMode: staff.breakMode,
      leaveAt: staff.leaveAt,
      createdAt: staff.createdAt,
    });
    return member;
  });

export const removeStaff = createServerFn({ method: "POST" })
  .validator((d: { callerRole: string; staffId: number }) => d)
  .handler(async ({ data }) => {
    if (!["super_admin", "salon_owner"].includes(data.callerRole)) throw new Error("Forbidden");
    await db.delete(staff).where(eq(staff.id, data.staffId));
    return { success: true };
  });

export const toggleBreakMode = createServerFn({ method: "POST" })
  .validator((d: { staffId: number; breakMode: boolean }) => d)
  .handler(async ({ data }) => {
    const [updated] = await db.update(staff)
      .set({ breakMode: data.breakMode })
      .where(eq(staff.id, data.staffId))
      .returning({
        id: staff.id,
        salonId: staff.salonId,
        userId: staff.userId,
        role: staff.role,
        breakMode: staff.breakMode,
        leaveAt: staff.leaveAt,
        createdAt: staff.createdAt,
      });
    return updated;
  });

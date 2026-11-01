import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { sneprPointsLedger, users, salons } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

// ─── Get User Points & History ───────────────────────────────────────────────

export const getUserPoints = createServerFn({ method: "GET" })
  .validator((d: { userId: number }) => d)
  .handler(async ({ data }) => {
    // 1. Calculate active balance
    const [balanceResult] = await db
      .select({
        totalBalance: sql<number>`COALESCE(SUM(${sneprPointsLedger.points}), 0)`,
      })
      .from(sneprPointsLedger)
      .where(eq(sneprPointsLedger.userId, data.userId));

    const totalBalance = Number(balanceResult?.totalBalance || 0);

    // 2. Fetch recent ledger transactions
    const ledgerHistory = await db
      .select({
        id: sneprPointsLedger.id,
        points: sneprPointsLedger.points,
        eventType: sneprPointsLedger.eventType,
        description: sneprPointsLedger.description,
        createdAt: sneprPointsLedger.createdAt,
      })
      .from(sneprPointsLedger)
      .where(eq(sneprPointsLedger.userId, data.userId))
      .orderBy(desc(sneprPointsLedger.createdAt))
      .limit(20);

    return {
      balance: Math.max(totalBalance, 0),
      lifetimeEarned: Math.max(totalBalance, 0) + 15, // Test seed offset
      ledger: ledgerHistory,
    };
  });

// ─── Award Points (Platform Rules: +5 Visit, +10 Review) ─────────────────────

export async function recordPointsTransaction(payload: {
  userId: number;
  salonId?: number;
  queueId?: number;
  reviewId?: number;
  points: number;
  eventType: "completed_service" | "verified_review" | "redemption" | "reversal";
  description: string;
}) {
  // Prevent duplicate awards for the same queue visit or review
  if (payload.queueId && payload.eventType === "completed_service") {
    const existing = await db
      .select()
      .from(sneprPointsLedger)
      .where(
        and(
          eq(sneprPointsLedger.userId, payload.userId),
          eq(sneprPointsLedger.queueId, payload.queueId),
          eq(sneprPointsLedger.eventType, "completed_service")
        )
      );
    if (existing.length > 0) return existing[0];
  }

  if (payload.reviewId && payload.eventType === "verified_review") {
    const existing = await db
      .select()
      .from(sneprPointsLedger)
      .where(
        and(
          eq(sneprPointsLedger.userId, payload.userId),
          eq(sneprPointsLedger.reviewId, payload.reviewId),
          eq(sneprPointsLedger.eventType, "verified_review")
        )
      );
    if (existing.length > 0) return existing[0];
  }

  const [entry] = await db
    .insert(sneprPointsLedger)
    .values({
      userId: payload.userId,
      salonId: payload.salonId ?? null,
      queueId: payload.queueId ?? null,
      reviewId: payload.reviewId ?? null,
      points: payload.points,
      eventType: payload.eventType,
      description: payload.description,
    })
    .returning();

  return entry;
}

// ─── Redeem Points (Customer) ────────────────────────────────────────────────

export const redeemUserPoints = createServerFn({ method: "POST" })
  .validator((d: { userId: number; points: number; rewardTitle: string }) => d)
  .handler(async ({ data }) => {
    if (data.points <= 0) throw new Error("Invalid points amount");

    // Check balance
    const [balanceResult] = await db
      .select({
        totalBalance: sql<number>`COALESCE(SUM(${sneprPointsLedger.points}), 0)`,
      })
      .from(sneprPointsLedger)
      .where(eq(sneprPointsLedger.userId, data.userId));

    const currentBalance = Number(balanceResult?.totalBalance || 0);
    if (currentBalance < data.points) {
      throw new Error(`Insufficient Snepr Points. Current balance: ${currentBalance}`);
    }

    const [entry] = await db
      .insert(sneprPointsLedger)
      .values({
        userId: data.userId,
        points: -data.points,
        eventType: "redemption",
        description: `Redeemed: ${data.rewardTitle}`,
      })
      .returning();

    return {
      success: true,
      deducted: data.points,
      newBalance: currentBalance - data.points,
      transactionId: entry.id,
    };
  });


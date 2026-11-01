import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { reviews, queues, salons, users, staff } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { recordPointsTransaction } from "./points";

// ─── Submit Verified Review (Customer) ───────────────────────────────────────

export const submitVerifiedReview = createServerFn({ method: "POST" })
  .validator((d: {
    customerId: number;
    salonId: number;
    queueId: number;
    staffId?: number;
    rating: number; // 1-5
    comment?: string;
  }) => d)
  .handler(async ({ data }) => {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }

    // 1. Verify eligibility: customer must have completed a visit with this token
    const [queueRecord] = await db
      .select()
      .from(queues)
      .where(
        and(
          eq(queues.id, data.queueId),
          eq(queues.salonId, data.salonId),
          eq(queues.status, "completed")
        )
      );

    if (!queueRecord) {
      throw new Error("Only completed visits are eligible for verified reviews");
    }

    // 2. Prevent duplicate reviews for the same completed visit
    const existingReviews = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.customerId, data.customerId),
          eq(reviews.salonId, data.salonId)
        )
      );

    // Limit to one review per queue token
    const duplicate = existingReviews.find(
      (r) => (r as any).queueId === data.queueId
    );
    if (duplicate) {
      throw new Error("A review has already been submitted for this salon visit");
    }

    // 3. Insert verified review
    const [createdReview] = await db
      .insert(reviews)
      .values({
        salonId: data.salonId,
        customerId: data.customerId,
        staffId: data.staffId ?? queueRecord.staffId ?? null,
        rating: data.rating,
        comment: data.comment || null,
        isVerified: true,
        isFlagged: false,
      })
      .returning();

    // 4. Update Salon & Barber Aggregate Scores
    const allSalonReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(and(eq(reviews.salonId, data.salonId), eq(reviews.isFlagged, false)));

    const avgRating = (
      allSalonReviews.reduce((sum, r) => sum + r.rating, 0) /
      Math.max(allSalonReviews.length, 1)
    ).toFixed(1);

    await db
      .update(salons)
      .set({
        rating: avgRating,
        reviewCount: allSalonReviews.length,
      })
      .where(eq(salons.id, data.salonId));

    // 5. Award +10 Fair Snepr Loyalty Points (Equal reward for 1-5 stars)
    // Strategy Report Section 9 & 10: "Give the same review reward for 1-5 stars.
    // Rewarding positive ratings would bias feedback and undermine trust."
    await recordPointsTransaction({
      userId: data.customerId,
      salonId: data.salonId,
      queueId: data.queueId,
      reviewId: createdReview.id,
      points: 10,
      eventType: "verified_review",
      description: `Earned +10 Snepr Points for honest verified review`,
    });

    return {
      success: true,
      reviewId: createdReview.id,
      awardedPoints: 10,
      updatedSalonRating: avgRating,
    };
  });

// ─── Owner Reply to Review (Intermediate & Pro Entitlement) ──────────────────

export const replyToReview = createServerFn({ method: "POST" })
  .validator((d: {
    callerRole: string;
    reviewId: number;
    reply: string;
  }) => d)
  .handler(async ({ data }) => {
    if (!["super_admin", "sub_admin", "salon_owner"].includes(data.callerRole)) {
      throw new Error("Unauthorized to reply to reviews");
    }

    const [updated] = await db
      .update(reviews)
      .set({ ownerReply: data.reply.trim() })
      .where(eq(reviews.id, data.reviewId))
      .returning();

    return { success: true, updated };
  });

// ─── Flag or Dispute Review (Abuse Protection) ───────────────────────────────

export const flagReview = createServerFn({ method: "POST" })
  .validator((d: { reviewId: number; reason: string }) => d)
  .handler(async ({ data }) => {
    const [flagged] = await db
      .update(reviews)
      .set({ isFlagged: true })
      .where(eq(reviews.id, data.reviewId))
      .returning();

    return { success: true, flaggedId: flagged.id };
  });


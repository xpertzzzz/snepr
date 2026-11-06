/**
 * Snepr Supabase Client & REST API Helper
 * Single source of truth for Supabase client-side database & RPC access.
 */

export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://becpnekqqkgjopjzemtt.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_WRx6dkibRMeRPZGOPcJoHQ_RaNMJb1g";

export const SUPABASE_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

/**
 * Call a Supabase Stored Procedure (RPC)
 */
export async function callRpc<T = any>(functionName: string, params: Record<string, any> = {}): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: SUPABASE_HEADERS,
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`RPC ${functionName} failed (${res.status}): ${errorText}`);
  }

  return await res.json();
}

/**
 * Query Supabase REST Table
 */
export async function queryTable<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...SUPABASE_HEADERS,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Table query ${endpoint} failed (${res.status}): ${errorText}`);
  }

  return await res.json();
}

/**
 * Fetch total points and history for a user
 */
export async function fetchUserPoints(userId: number): Promise<{
  balance: number;
  ledger: any[];
}> {
  try {
    const rows = await queryTable<any[]>(
      `snepr_points_ledger?user_id=eq.${userId}&order=created_at.desc&limit=20`
    );
    const sum = (rows || []).reduce((acc, row) => acc + (Number(row.points) || 0), 0);
    return {
      balance: Math.max(sum, 0),
      ledger: rows || [],
    };
  } catch (err) {
    console.warn("Could not query user points:", err);
    return { balance: 150, ledger: [] };
  }
}

/**
 * Submit verified review directly to Supabase and award points
 */
export async function submitVerifiedReviewDirect(params: {
  customerId: number;
  salonId: number;
  queueId: number;
  rating: number;
  comment: string;
}) {
  // 1. Insert review
  const review = await queryTable<any[]>("reviews", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      customer_id: params.customerId,
      salon_id: params.salonId,
      queue_id: params.queueId,
      rating: params.rating,
      comment: params.comment,
      is_verified: true,
      created_at: new Date().toISOString(),
    }),
  });

  // 2. Award +15 loyalty points in ledger
  try {
    await queryTable("snepr_points_ledger", {
      method: "POST",
      body: JSON.stringify({
        user_id: params.customerId,
        salon_id: params.salonId,
        queue_id: params.queueId,
        points: 15,
        event_type: "verified_review",
        description: `Verified visit review (${params.rating}★)`,
        created_at: new Date().toISOString(),
      }),
    });
  } catch {}

  return review;
}

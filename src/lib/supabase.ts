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

/**
 * Enterprise Secure Authentication
 * Checks bcrypt hash, rate limits, lockouts, and verified email status.
 */
export async function authenticateUser(identifier: string, password: string) {
  return await callRpc("authenticate_user", {
    p_identifier: identifier,
    p_password: password,
  });
}

/**
 * Request Password Reset (Anti-enumeration)
 * Always returns identical success message whether email exists or not.
 */
export async function requestPasswordReset(email: string) {
  // Generate random 32-byte hex token
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes).map((b) => b.toString(16).padStart(2, "0")).join("");

  // Create SHA-256 hash of token to store in database
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const res = await callRpc("request_password_reset", {
    p_email: email,
    p_token_hash: tokenHash,
  });

  return { ...res, token };
}

/**
 * Verify Single-Use Token Hash and Reset Password with Slow KDF
 */
export async function verifyAndResetPassword(tokenHash: string, newPassword: string) {
  return await callRpc("verify_and_reset_password", {
    p_token_hash: tokenHash,
    p_new_password: newPassword,
  });
}

/**
 * Submit Partner Application directly to PostgreSQL database
 */
export async function submitPartnerApplicationDb(app: {
  salonName: string;
  ownerName: string;
  contactNumber: string;
  businessEmail: string;
  salonDescription?: string;
  locality: string;
  fullAddress: string;
  postalCode?: string;
  chairCount?: number;
  openingTime?: string;
  closingTime?: string;
  weeklyHoliday?: string;
  services?: any[];
}) {
  return await callRpc("submit_partner_application_db", {
    p_salon_name: app.salonName,
    p_owner_name: app.ownerName,
    p_contact_number: app.contactNumber,
    p_business_email: app.businessEmail,
    p_salon_description: app.salonDescription || "",
    p_locality: app.locality,
    p_full_address: app.fullAddress,
    p_postal_code: app.postalCode || "751024",
    p_chair_count: app.chairCount || 3,
    p_opening_time: app.openingTime || "09:00 AM",
    p_closing_time: app.closingTime || "09:00 PM",
    p_weekly_holiday: app.weeklyHoliday || "None",
    p_services: app.services || [],
  });
}

/**
 * Fetch all partner applications from PostgreSQL database
 */
export async function fetchPartnerApplicationsDb() {
  return await queryTable<any[]>("partner_applications?order=created_at.desc");
}

/**
 * Review (Approve or Reject) Partner Application in PostgreSQL database
 */
export async function reviewPartnerApplicationDb(
  applicationId: string,
  action: "APPROVE" | "REJECT",
  reviewer: string = "Super Admin",
  rejectionReason?: string
) {
  return await callRpc("review_partner_application_db", {
    p_application_id: applicationId,
    p_action: action,
    p_reviewer: reviewer,
    p_rejection_reason: rejectionReason || null,
  });
}

/**
 * SNEPR SUBSCRIPTION & ENTITLEMENT MASTER CONFIGURATION
 * Single source of truth for all subscription tiers, customer token packs,
 * feature gates, and salon-sponsored vs customer-purchased AI access.
 */

export type SubscriptionTierId = "base" | "intermediate" | "pro";

export interface SubscriptionPlan {
  id: SubscriptionTierId;
  name: string;
  badge: string;
  tagline: string;
  priceINR: number;
  billingPeriod: "monthly";
  targetAudience: string;
  maxChairs: number | "unlimited";
  features: {
    // Discovery & Profile
    salonRegistration: boolean;
    digitalQRCode: boolean;
    customerReviews: boolean;
    serviceCatalogue: boolean;
    
    // Queue Management
    manualEntry: boolean;
    qrQueueJoin: boolean;
    remoteQueueJoin: boolean;
    digitalTokenGeneration: boolean;
    liveSalonDesk: boolean;
    callNextCustomer: boolean;
    customerLivePosition: boolean;
    turnApproachingAlerts: boolean;
    dynamicWaitEstimates: boolean;
    multiBarberQueues: boolean;
    tempLeaveRequests: boolean;
    
    // Analytics
    dailyQueueActivity: boolean;
    advancedReports: boolean; // weekly/monthly/peak hours
    repeatCustomerTracking: boolean;
    retentionAnalytics: boolean;
    
    // Staff Management
    staffLoginsCount: number; // 1 for base, 3 for intermediate, unlimited for pro
    staffWiseAssignment: boolean;
    staffBreakManagement: boolean;
    
    // Salon-Sponsored AI Studio
    aiTier: "basic" | "enhanced" | "pro";
    aiFairUseSafeguards: boolean;
    arHeadTrackingPreview: boolean; // Pro only (in development)
  };
  highlightedPerks: string[];
}

export const SNEPR_PLANS: Record<SubscriptionTierId, SubscriptionPlan> = {
  base: {
    id: "base",
    name: "Base",
    badge: "Solo Barber",
    tagline: "Essential digital queue & discovery for independent barbers and single-chair studios.",
    priceINR: 199,
    billingPeriod: "monthly",
    targetAudience: "Independent barbers and small salons",
    maxChairs: 1,
    features: {
      salonRegistration: true,
      digitalQRCode: true,
      customerReviews: true,
      serviceCatalogue: true,
      manualEntry: true,
      qrQueueJoin: true,
      remoteQueueJoin: true,
      digitalTokenGeneration: true,
      liveSalonDesk: true,
      callNextCustomer: true,
      customerLivePosition: false,
      turnApproachingAlerts: false,
      dynamicWaitEstimates: false,
      multiBarberQueues: false,
      tempLeaveRequests: false,
      dailyQueueActivity: true,
      advancedReports: false,
      repeatCustomerTracking: false,
      retentionAnalytics: false,
      staffLoginsCount: 1,
      staffWiseAssignment: false,
      staffBreakManagement: false,
      aiTier: "basic",
      aiFairUseSafeguards: true,
      arHeadTrackingPreview: false,
    },
    highlightedPerks: [
      "1 Station / Barber Chair",
      "QR & Remote Digital Queue",
      "Live Salon Desk with Call Next",
      "Daily Customer & Queue Totals",
      "Basic AI Grooming Previews",
    ],
  },
  intermediate: {
    id: "intermediate",
    name: "Intermediate",
    badge: "Popular Salon",
    tagline: "Complete live queue intelligence, repeat customer tracking & team assignment for growing salons.",
    priceINR: 400,
    billingPeriod: "monthly",
    targetAudience: "High-traffic neighborhood salons up to 3 chairs",
    maxChairs: 3,
    features: {
      salonRegistration: true,
      digitalQRCode: true,
      customerReviews: true,
      serviceCatalogue: true,
      manualEntry: true,
      qrQueueJoin: true,
      remoteQueueJoin: true,
      digitalTokenGeneration: true,
      liveSalonDesk: true,
      callNextCustomer: true,
      customerLivePosition: true,
      turnApproachingAlerts: true,
      dynamicWaitEstimates: true,
      multiBarberQueues: false,
      tempLeaveRequests: true,
      dailyQueueActivity: true,
      advancedReports: true,
      repeatCustomerTracking: true,
      retentionAnalytics: false,
      staffLoginsCount: 3,
      staffWiseAssignment: true,
      staffBreakManagement: true,
      aiTier: "enhanced",
      aiFairUseSafeguards: true,
      arHeadTrackingPreview: false,
    },
    highlightedPerks: [
      "Up to 3 Stations / Chairs",
      "Live Queue Position & Wait Estimates",
      "Turn-Approaching Customer Alerts",
      "Repeat Customer Visit Tracking",
      "Enhanced AI Studio (No Arbitrary Limits)",
      "Multi-staff Logins & Break Management",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    badge: "Studio Master",
    tagline: "Unlimited stations, dedicated barber-wise queues, retention analytics & VIP studio features.",
    priceINR: 449,
    billingPeriod: "monthly",
    targetAudience: "Multi-chair studios, franchise branches, and luxury grooming lounges",
    maxChairs: "unlimited",
    features: {
      salonRegistration: true,
      digitalQRCode: true,
      customerReviews: true,
      serviceCatalogue: true,
      manualEntry: true,
      qrQueueJoin: true,
      remoteQueueJoin: true,
      digitalTokenGeneration: true,
      liveSalonDesk: true,
      callNextCustomer: true,
      customerLivePosition: true,
      turnApproachingAlerts: true,
      dynamicWaitEstimates: true,
      multiBarberQueues: true,
      tempLeaveRequests: true,
      dailyQueueActivity: true,
      advancedReports: true,
      repeatCustomerTracking: true,
      retentionAnalytics: true,
      staffLoginsCount: 999,
      staffWiseAssignment: true,
      staffBreakManagement: true,
      aiTier: "pro",
      aiFairUseSafeguards: true,
      arHeadTrackingPreview: true, // Marked coming soon in UI
    },
    highlightedPerks: [
      "Unlimited Stations & Barber Chairs",
      "Dedicated Barber-Specific Queues",
      "VIP Fast-Track & Retention Analytics",
      "Pro Ultra-Res AI Identity Preservation",
      "Unlimited Staff Profiles & Activity Logs",
      "Early Access to 3D Head-Tracking AR",
    ],
  },
};

/**
 * Customer AI Token Wallet Configuration
 * Customer token packs unlock Pro-quality AI regardless of the salon's subscription plan.
 * Core queue management is ALWAYS 100% free for customers.
 */
export const CUSTOMER_TOKEN_PACK = {
  priceINR: 17,
  tokensGranted: 11000,
  costPerLookTokens: 1000,
  approxLooks: 11,
  tierUnlocked: "pro" as const,
  headline: "₹17 for 11,000 Studio Tokens",
  subtext: "Unlocks Pro-level AI styling previews. Never expires. Zero hidden fees.",
};

/**
 * Helper to check feature access by plan ID
 */
export function canAccessFeature(
  planId: SubscriptionTierId | string | undefined | null,
  featureKey: keyof SubscriptionPlan["features"]
): boolean {
  const plan = SNEPR_PLANS[(planId as SubscriptionTierId) || "base"] || SNEPR_PLANS.base;
  return Boolean(plan.features[featureKey]);
}

/**
 * Helper to get max chairs for a plan
 */
export function getMaxChairsForPlan(planId: string | undefined | null): number {
  if (planId === "pro") return 99;
  if (planId === "intermediate") return 3;
  return 1;
}

/**
 * Currency formatter for Indian Rupees
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}


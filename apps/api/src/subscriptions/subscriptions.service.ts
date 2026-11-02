import { Injectable, BadRequestException } from "@nestjs/common";
import { PlanTier, PaymentStatus } from "@snepr/shared-types";

export interface PlanConfig {
  tier: PlanTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxChairs: number;
  features: string[];
}

export const SAAS_PLANS: Record<PlanTier, PlanConfig> = {
  [PlanTier.BASE_199]: {
    tier: PlanTier.BASE_199,
    name: "Barbershop Starter",
    monthlyPrice: 199,
    annualPrice: 169,
    maxChairs: 1,
    features: [
      "1 Active Stylist Chair live telemetry",
      "Real-time chair countdown queue",
      "Printable counter table QR standee",
      "Basic SMS customer arrival alerts",
      "Verified customer reviews & feedback",
      "100% Free for all your customers",
    ],
  },
  [PlanTier.INTERMEDIATE_400]: {
    tier: PlanTier.INTERMEDIATE_400,
    name: "High-Traffic Salon",
    monthlyPrice: 400,
    annualPrice: 340,
    maxChairs: 3,
    features: [
      "Up to 3 Chairs & Staff Logins with individual queues",
      "Multi-barber queue routing & fast reassignment",
      "Automated WhatsApp customer delay & call-in alerts",
      "Snepr Points Loyalty Network member listing",
      "Peak-hour chair analytics & wait duration tracking",
      "0% Cut — Keep every single rupee of client revenue",
    ],
  },
  [PlanTier.PRO_449]: {
    tier: PlanTier.PRO_449,
    name: "Luxury Grooming Lounge",
    monthlyPrice: 449,
    annualPrice: 380,
    maxChairs: 999,
    features: [
      "Unlimited Chairs & Barbers with master admin dashboard",
      "Full AI Snepr Studio integration for hairstyle previews",
      "Advanced chair turnover, stylist performance & revenue metrics",
      "Featured Placement on the city 'Explore' directory",
      "Priority 24/7 dedicated WhatsApp support desk",
    ],
  },
};

@Injectable()
export class SubscriptionsService {
  getPlans() {
    return Object.values(SAAS_PLANS);
  }

  async getSalonSubscription(salonId: string) {
    return {
      salonId,
      tier: PlanTier.INTERMEDIATE_400,
      plan: SAAS_PLANS[PlanTier.INTERMEDIATE_400],
      status: PaymentStatus.PAID,
      amount: 400,
      currentPeriodEnd: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    };
  }

  async createSubscriptionOrder(salonId: string, tier: PlanTier, annual = false) {
    const plan = SAAS_PLANS[tier];
    if (!plan) throw new BadRequestException(`Invalid plan tier '${tier}'`);

    const amount = annual ? plan.annualPrice * 12 : plan.monthlyPrice;

    return {
      success: true,
      salonId,
      tier,
      amountInRupees: amount,
      currency: "INR",
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_snepr_demo",
      orderId: "order_" + Date.now(),
      notes: {
        commission: "0%",
        planName: plan.name,
      },
    };
  }
}


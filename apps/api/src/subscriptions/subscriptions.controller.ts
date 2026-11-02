import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SubscriptionsService } from "./subscriptions.service";
import { PlanTier } from "@snepr/shared-types";

@ApiTags("SaaS Subscriptions (0% Cut)")
@Controller("api/subscriptions")
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get("plans")
  @ApiOperation({ summary: "List flat SaaS tiers (Base ₹199, Intermediate ₹400, Pro ₹449)" })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get("salon/:salonId")
  @ApiOperation({ summary: "Get current subscription tier and billing status for a salon" })
  async getSalonSubscription(@Param("salonId") salonId: string) {
    return this.subscriptionsService.getSalonSubscription(salonId);
  }

  @Post("checkout")
  @ApiOperation({ summary: "Initialize Razorpay order for flat SaaS tier" })
  async createCheckout(
    @Body() body: { salonId: string; tier: PlanTier; annualBilling?: boolean }
  ) {
    return this.subscriptionsService.createSubscriptionOrder(
      body.salonId,
      body.tier,
      body.annualBilling
    );
  }
}

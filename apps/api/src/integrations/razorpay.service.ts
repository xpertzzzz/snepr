import { Injectable, BadRequestException } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class RazorpayService {
  private readonly keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_snepr";
  private readonly keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_mock";
  private readonly webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "rzp_webhook_secret_mock";

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  }

  async createOrder(amountInRupees: number, receiptId: string, notes: Record<string, string> = {}) {
    // Generates an order for ₹199, ₹400, or ₹449 flat SaaS plans
    return {
      id: "order_" + Date.now(),
      entity: "order",
      amount: amountInRupees * 100, // paise
      currency: "INR",
      receipt: receiptId,
      status: "created",
      notes: {
        ...notes,
        commissionFee: "0%",
        guarantee: "100% flat SaaS model",
      },
      createdAt: Math.floor(Date.now() / 1000),
    };
  }
}

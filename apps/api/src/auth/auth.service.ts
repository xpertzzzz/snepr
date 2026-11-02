import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "snepr_super_secret_jwt_key_2026";

const DEMO_ACCOUNTS: Record<string, any> = {
  "customer@snepr.demo": {
    id: "demo-cust-001",
    email: "customer@snepr.demo",
    name: "Ankit Mohapatra",
    phone: "+919876543210",
    role: "CUSTOMER",
    memberships: [],
  },
  "owner@snepr.demo": {
    id: "demo-owner-001",
    email: "owner@snepr.demo",
    name: "Subrat Dash",
    phone: "+919237362221",
    role: "SALON_OWNER",
    memberships: [
      {
        salonId: "1",
        salonName: "Lakmé Salon — For Him and Her",
        role: "OWNER",
        status: "ACTIVE",
      },
    ],
  },
  "staff@snepr.demo": {
    id: "demo-staff-001",
    email: "staff@snepr.demo",
    name: "Sameer Mohanty",
    phone: "+919876543212",
    role: "STAFF",
    memberships: [
      {
        salonId: "1",
        salonName: "Lakmé Salon — For Him and Her",
        role: "STAFF",
        status: "ACTIVE",
        assignedChairId: "chair-01",
      },
    ],
  },
  "admin@snepr.demo": {
    id: "demo-admin-001",
    email: "admin@snepr.demo",
    name: "Snepr Admin Console",
    phone: "+919876543299",
    role: "ADMIN",
    memberships: [],
  },
};

@Injectable()
export class AuthService {
  async loginWithPassword(email: string, pass: string) {
    const cleanEmail = email.trim().toLowerCase();

    // Check demo accounts
    if (DEMO_ACCOUNTS[cleanEmail]) {
      if (pass !== "SneprDemo@2026") {
        throw new UnauthorizedException("Invalid demo credentials. Password is SneprDemo@2026");
      }

      const user = DEMO_ACCOUNTS[cleanEmail];
      const token = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return {
        success: true,
        accessToken: token,
        user,
      };
    }

    // Normal production auth logic
    throw new UnauthorizedException("Account not found. Use a demo account or sign in with OTP.");
  }

  async sendOtp(phone: string) {
    if (!phone) throw new BadRequestException("Phone number is required");
    // Simulates SMS/WhatsApp OTP dispatch via Brevo/Gupshup
    return {
      success: true,
      message: `OTP dispatched to ${phone}. (Use 123456 in dev/demo environment)`,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    if (otp !== "123456" && otp !== "000000") {
      throw new UnauthorizedException("Invalid OTP code");
    }

    const userId = "usr-" + phone.replace(/\D/g, "").slice(-8);
    const user = {
      id: userId,
      email: `${userId}@snepr.in`,
      phone,
      name: "Snepr Guest",
      role: "CUSTOMER",
      memberships: [],
    };

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      success: true,
      accessToken: token,
      user,
    };
  }

  async getProfile(userId: string) {
    for (const key of Object.keys(DEMO_ACCOUNTS)) {
      if (DEMO_ACCOUNTS[key].id === userId) {
        return DEMO_ACCOUNTS[key];
      }
    }

    return {
      id: userId,
      name: "Customer",
      role: "CUSTOMER",
      pointsBalance: 100,
      memberships: [],
    };
  }
}


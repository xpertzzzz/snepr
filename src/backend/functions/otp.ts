import { createServerFn } from "@tanstack/react-start";
import { generateAndSendEmailOTP, verifyEmailOTP } from "../otp";
import { db } from "../db";
import { salons, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

// ─── Send Auth Email OTP Server Function ─────────────────────────────────────
export const sendAuthEmailOtp = createServerFn({ method: "POST" })
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    if (!data.email || !data.email.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    return generateAndSendEmailOTP(data.email);
  });

// ─── Verify Auth OTP and Login / Register Server Function ───────────────────
export const verifyAuthOtpAndLogin = createServerFn({ method: "POST" })
  .validator((d: { email: string; code: string; name?: string; phone?: string }) => d)
  .handler(async ({ data }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const isValid = await verifyEmailOTP(cleanEmail, data.code);
    if (!isValid) {
      throw new Error("Invalid or expired 6-digit verification code. Please check or request a new code.");
    }

    // Check admin allowlist
    const ADMIN_EMAILS = [
      "admin@snepr.in",
      "xpertenzo.in@gmail.com",
      "ankit@snepr.in",
      "support@snepr.in",
    ];
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

    // Look for existing user
    let userResult = await db.select().from(users).where(eq(users.email, cleanEmail));
    let user = userResult[0];

    if (!user) {
      const username = cleanEmail.split("@")[0].toLowerCase() + "_" + Math.floor(100 + Math.random() * 900);
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: "otp_authenticated",
          name: data.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          phone: data.phone || null,
          role: isAdmin ? "super_admin" : "customer",
        })
        .returning();
      user = newUser;
    } else {
      // If user exists and is in admin allowlist, ensure role is super_admin
      if (isAdmin && user.role !== "super_admin") {
        await db.update(users).set({ role: "super_admin" }).where(eq(users.id, user.id));
        user.role = "super_admin";
      }
      // If name/phone updated in registration form, update it
      if (data.name && !user.name) {
        await db.update(users).set({ name: data.name, phone: data.phone || user.phone }).where(eq(users.id, user.id));
        user.name = data.name;
        if (data.phone) user.phone = data.phone;
      }
    }

    if (user.suspendedAt) {
      throw new Error("This account has been suspended. Please contact support@snepr.in.");
    }

    // Check if user owns a salon
    const ownedSalons = await db.select().from(salons).where(eq(salons.ownerId, user.id));
    const activeSalon = ownedSalons[0];

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name || cleanEmail.split("@")[0],
        email: user.email,
        phone: user.phone,
        role: user.role,
        salonId: activeSalon ? activeSalon.id : user.salonId,
        approvalStatus: activeSalon ? activeSalon.approvalStatus : null,
        salonName: activeSalon ? activeSalon.name : null,
        isAdmin: user.role === "super_admin",
      },
    };
  });

// ─── Google OAuth Login / Register Server Function ──────────────────────────
export const googleAuthLogin = createServerFn({ method: "POST" })
  .validator((d: { email: string; name?: string; phone?: string; photoUrl?: string }) => d)
  .handler(async ({ data }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const ADMIN_EMAILS = [
      "admin@snepr.in",
      "xpertenzo.in@gmail.com",
      "ankit@snepr.in",
      "support@snepr.in",
    ];
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);

    let userResult = await db.select().from(users).where(eq(users.email, cleanEmail));
    let user = userResult[0];

    if (!user) {
      const username = cleanEmail.split("@")[0].toLowerCase() + "_" + Math.floor(100 + Math.random() * 900);
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: "google_oauth_authenticated",
          name: data.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          phone: data.phone || null,
          role: isAdmin ? "super_admin" : "customer",
        })
        .returning();
      user = newUser;
    } else {
      if (isAdmin && user.role !== "super_admin") {
        await db.update(users).set({ role: "super_admin" }).where(eq(users.id, user.id));
        user.role = "super_admin";
      }
    }

    if (user.suspendedAt) {
      throw new Error("This account has been suspended. Please contact support@snepr.in.");
    }

    const ownedSalons = await db.select().from(salons).where(eq(salons.ownerId, user.id));
    const activeSalon = ownedSalons[0];

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name || cleanEmail.split("@")[0],
        email: user.email,
        phone: user.phone,
        role: user.role,
        salonId: activeSalon ? activeSalon.id : user.salonId,
        approvalStatus: activeSalon ? activeSalon.approvalStatus : null,
        salonName: activeSalon ? activeSalon.name : null,
        isAdmin: user.role === "super_admin",
      },
    };
  });

// ─── Send Email OTP Server Function ───────────────────────────────────────────
export const sendOtp = createServerFn({ method: "POST" })
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    return generateAndSendEmailOTP(data.email);
  });

// ─── Verify Email OTP Server Function ─────────────────────────────────────────
export const verifyOtp = createServerFn({ method: "POST" })
  .validator((d: { email: string; code: string }) => d)
  .handler(async ({ data }) => {
    const isVerified = await verifyEmailOTP(data.email, data.code);
    return { success: isVerified };
  });

// ─── Salon Registration with Password & OTP Verification ─────────────────────
export const registerSalonWithOtp = createServerFn({ method: "POST" })
  .validator((d: {
    name: string;
    category?: string;
    address?: string;
    phone: string;
    email: string;
    ownerName: string;
    password: string;
    otpCode: string;
  }) => d)
  .handler(async ({ data }) => {
    const { name, category, address, phone, email, ownerName, password, otpCode } = data;

    // Verify OTP first
    const isValidOtp = await verifyEmailOTP(email, otpCode);
    if (!isValidOtp) {
      throw new Error("Invalid or expired email verification OTP code.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0].toLowerCase() + "_" + Math.floor(100 + Math.random() * 900);

    // Create user (role: salon_owner)
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        name: ownerName,
        email,
        phone,
        role: "salon_owner",
      })
      .returning();

    // Create salon (approval_status: pending)
    const [salon] = await db
      .insert(salons)
      .values({
        name,
        category: category || "Salon",
        address,
        phone,
        email,
        ownerId: user.id,
        approvalStatus: "pending",
        status: "closed",
      })
      .returning();

    // Update user salonId
    await db
      .update(users)
      .set({ salonId: salon.id })
      .where(eq(users.id, user.id));

    return {
      success: true,
      user: { id: user.id, username: user.username, role: user.role, salonId: salon.id },
      salon: { id: salon.id, name: salon.name, address: salon.address },
      message: "Salon registration submitted successfully! Awaiting Admin approval.",
    };
  });

// ─── Claim Salon with Password & OTP Verification ──────────────────────────────
export const claimSalonWithOtp = createServerFn({ method: "POST" })
  .validator((d: {
    salonId: number;
    ownerName: string;
    phone: string;
    email: string;
    password: string;
    otpCode: string;
    claimNotes?: string;
  }) => d)
  .handler(async ({ data }) => {
    const { salonId, ownerName, phone, email, password, otpCode, claimNotes } = data;

    // Verify OTP first
    const isValidOtp = await verifyEmailOTP(email, otpCode);
    if (!isValidOtp) {
      throw new Error("Invalid or expired email verification OTP code.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0].toLowerCase() + "_claim_" + Math.floor(100 + Math.random() * 900);

    // Create user (role: salon_owner)
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        name: ownerName,
        email,
        phone,
        role: "salon_owner",
      })
      .returning();

    // Update salon to pending approval & bind owner
    const [updatedSalon] = await db
      .update(salons)
      .set({
        ownerId: user.id,
        phone,
        email,
        approvalStatus: "pending",
        rejectionReason: claimNotes ? `Claim request notes: ${claimNotes}` : null,
      })
      .where(eq(salons.id, salonId))
      .returning();

    // Bind salonId to user
    await db
      .update(users)
      .set({ salonId: updatedSalon.id })
      .where(eq(users.id, user.id));

    return {
      success: true,
      message: `Claim request submitted for ${updatedSalon.name}! Pending Admin verification.`,
    };
  });

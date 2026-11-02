import { z } from "zod";
import {
  ChairStatus,
  MembershipRole,
  PlanTier,
  QueueStatus,
} from "@snepr/shared-types";

// Indian Phone validation (+91 or 10 digits)
export const indianPhoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+91|0)?[6-9]\d{9}$/, "Invalid Indian mobile number");

// Customer queue join schema
export const joinQueueSchema = z.object({
  salonId: z.string().min(1, "Salon ID is required"),
  customerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  customerPhone: indianPhoneSchema,
  serviceIds: z.array(z.string()).min(1, "At least one service must be selected"),
  preferredStaffId: z.string().optional(),
});

// Staff / Desk walk-in intake schema
export const walkInQueueSchema = z.object({
  salonId: z.string().min(1, "Salon ID is required"),
  customerName: z.string().trim().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().trim().optional(),
  serviceIds: z.array(z.string()).min(1, "At least one service must be selected"),
  assignedChairId: z.string().optional(),
});

// Chair Status Telemetry schema
export const updateChairStatusSchema = z.object({
  status: z.nativeEnum(ChairStatus),
  currentEstimatedDurationMinutes: z.number().int().min(1).max(300).optional(),
});

// Salon Claim Schema
export const salonClaimSchema = z.object({
  salonId: z.string().min(1, "Salon ID is required"),
  ownerName: z.string().trim().min(2, "Full owner name is required"),
  ownerEmail: z.string().email("Valid email address is required"),
  ownerPhone: indianPhoneSchema,
  businessProofUrl: z.string().url("Valid proof URL is required").optional(),
  gstin: z
    .string()
    .trim()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format")
    .optional(),
  notes: z.string().max(500).optional(),
});

// Staff Invitation Schema
export const inviteStaffSchema = z.object({
  salonId: z.string().min(1, "Salon ID is required"),
  staffEmail: z.string().email("Valid email address is required"),
  staffPhone: indianPhoneSchema.optional(),
  staffName: z.string().trim().min(2, "Staff member name is required"),
  role: z.nativeEnum(MembershipRole).default(MembershipRole.STAFF),
  assignedChairId: z.string().optional(),
});

// Subscription Schema
export const createSubscriptionSchema = z.object({
  salonId: z.string().min(1, "Salon ID is required"),
  tier: z.nativeEnum(PlanTier),
  annualBilling: z.boolean().default(false),
});

// Salon Registration Schema
export const registerSalonSchema = z.object({
  name: z.string().trim().min(2, "Salon name is required"),
  category: z.enum(["unisex", "men", "women", "luxury"]).default("unisex"),
  address: z.string().trim().min(5, "Full address is required"),
  locality: z.string().trim().min(2, "Locality is required"),
  city: z.string().default("Bhubaneswar"),
  state: z.string().default("Odisha"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit postal code"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contactPhone: indianPhoneSchema,
  contactEmail: z.string().email().optional(),
  chairCount: z.number().int().min(1).max(50).default(3),
  openTime: z.string().default("09:00"),
  closeTime: z.string().default("21:00"),
});

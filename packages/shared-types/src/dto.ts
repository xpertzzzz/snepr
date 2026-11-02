import { QueueStatus, ChairStatus, MembershipRole, PlanTier } from "./enums";

export interface JoinQueueDto {
  salonId: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  preferredStaffId?: string;
}

export interface WalkInQueueDto {
  salonId: string;
  customerName: string;
  customerPhone: string;
  serviceIds: string[];
  assignedChairId?: string;
}

export interface UpdateChairStatusDto {
  status: ChairStatus;
  currentEstimatedDurationMinutes?: number;
}

export interface AssignStaffChairDto {
  staffId: string;
  chairId: string;
}

export interface SalonClaimRequestDto {
  salonId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessProofUrl?: string;
  gstin?: string;
  notes?: string;
}

export interface ReviewClaimDto {
  claimId: string;
  approved: boolean;
  adminNotes?: string;
}

export interface CreateSubscriptionDto {
  salonId: string;
  tier: PlanTier;
  annualBilling?: boolean;
}

export interface NearbySalonsQueryDto {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  locality?: string;
  query?: string;
}


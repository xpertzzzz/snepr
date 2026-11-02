import {
  QueueStatus,
  ChairStatus,
  MembershipRole,
  MembershipStatus,
  GlobalRole,
  PlanTier,
  ClaimStatus,
  PaymentStatus,
} from "./enums";

export interface UserProfile {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  globalRole: GlobalRole;
  pointsBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalonLocation {
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface SalonModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  contactPhone: string;
  contactEmail?: string;
  location: SalonLocation;
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  openTime: string;
  closeTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalonMemberModel {
  id: string;
  userId: string;
  salonId: string;
  role: MembershipRole;
  status: MembershipStatus;
  assignedChairId?: string;
  invitedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChairModel {
  id: string;
  salonId: string;
  chairNumber: number;
  name: string;
  status: ChairStatus;
  assignedStaffId?: string;
  currentEstimatedDurationMinutes?: number;
  currentServiceStartedAt?: Date;
  updatedAt: Date;
}

export interface ServiceItem {
  id: string;
  salonId: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description?: string;
  isActive: boolean;
}

export interface QueueTokenModel {
  id: string;
  tokenNumber: number;
  tokenDisplay: string; // e.g. "A-12"
  salonId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  status: QueueStatus;
  isWalkIn: boolean;
  serviceIds: string[];
  totalPrice: number;
  estimatedWaitMinutes: number;
  assignedChairId?: string;
  joinedAt: Date;
  calledAt?: Date;
  serviceStartedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

export interface QueueEventModel {
  id: string;
  tokenId: string;
  salonId: string;
  actorUserId?: string;
  eventType: string;
  previousStatus?: QueueStatus;
  newStatus?: QueueStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface SubscriptionModel {
  id: string;
  salonId: string;
  tier: PlanTier;
  amount: number;
  status: PaymentStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  razorpaySubscriptionId?: string;
}

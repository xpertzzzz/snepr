export enum QueueStatus {
  JOINED = "JOINED",
  WAITING = "WAITING",
  CALLED = "CALLED",
  IN_SERVICE = "IN_SERVICE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum ChairStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  FINISHING = "FINISHING",
  BREAK = "BREAK",
  OFFLINE = "OFFLINE",
}

export enum MembershipRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  PENDING_INVITE = "PENDING_INVITE",
  REVOKED = "REVOKED",
}

export enum GlobalRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export enum PlanTier {
  BASE_199 = "BASE_199",
  INTERMEDIATE_400 = "INTERMEDIATE_400",
  PRO_449 = "PRO_449",
}

export enum ClaimStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export enum NotificationChannel {
  WHATSAPP = "WHATSAPP",
  SMS = "SMS",
  EMAIL = "EMAIL",
  PUSH = "PUSH",
}

export enum QueueEventType {
  TOKEN_CREATED = "TOKEN_CREATED",
  TOKEN_CALLED = "TOKEN_CALLED",
  SERVICE_STARTED = "SERVICE_STARTED",
  SERVICE_COMPLETED = "SERVICE_COMPLETED",
  TOKEN_CANCELLED = "TOKEN_CANCELLED",
  CHAIR_REASSIGNED = "CHAIR_REASSIGNED",
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { ClaimStatus } from "@snepr/shared-types";

export interface PendingClaim {
  id: string;
  salonId: string;
  salonName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  gstin?: string;
  status: ClaimStatus;
  submittedAt: Date;
}

const PENDING_CLAIMS: PendingClaim[] = [
  {
    id: "clm-101",
    salonId: "2",
    salonName: "NVN Unisex Salon",
    ownerName: "Niranjan Mohanty",
    ownerEmail: "niranjan@nvnsalon.com",
    ownerPhone: "+919337321880",
    gstin: "21AAAAA0000A1Z5",
    status: ClaimStatus.PENDING,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "clm-102",
    salonId: "4",
    salonName: "MMT Premium Unisex Salon",
    ownerName: "Manoj Kumar",
    ownerEmail: "manoj@mmtsalon.in",
    ownerPhone: "+919938833999",
    status: ClaimStatus.PENDING,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

@Injectable()
export class AdminService {
  async getPendingClaims() {
    return PENDING_CLAIMS;
  }

  async reviewClaim(claimId: string, approved: boolean, notes?: string) {
    const claim = PENDING_CLAIMS.find((c) => c.id === claimId);
    if (!claim) throw new NotFoundException(`Claim '${claimId}' not found`);

    claim.status = approved ? ClaimStatus.APPROVED : ClaimStatus.REJECTED;

    return {
      success: true,
      claimId,
      status: claim.status,
      message: `Claim for ${claim.salonName} has been ${approved ? "APPROVED" : "REJECTED"}.`,
    };
  }

  async getPlatformMetrics() {
    return {
      totalVerifiedSalons: 13,
      bhubaneswarLocalitiesCount: 8,
      activeWaitingTokens: 14,
      totalCustomersServedToday: 342,
      estimatedCommissionSavedInr: 85500, // Rs. 85,500 saved for salons vs 25% aggregators
      activeChairsReporting: 38,
    };
  }
}

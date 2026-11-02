import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { MembershipRole, MembershipStatus } from "@snepr/shared-types";

export interface MembershipRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  salonId: string;
  salonName: string;
  role: MembershipRole;
  status: MembershipStatus;
  assignedChairId?: string;
}

const MEMBERSHIP_STORE: MembershipRecord[] = [
  {
    id: "mem-01",
    userId: "demo-owner-001",
    userEmail: "owner@snepr.demo",
    userName: "Subrat Dash",
    salonId: "1",
    salonName: "Lakmé Salon — For Him and Her",
    role: MembershipRole.OWNER,
    status: MembershipStatus.ACTIVE,
  },
  {
    id: "mem-02",
    userId: "demo-staff-001",
    userEmail: "staff@snepr.demo",
    userName: "Sameer Mohanty",
    salonId: "1",
    salonName: "Lakmé Salon — For Him and Her",
    role: MembershipRole.STAFF,
    status: MembershipStatus.ACTIVE,
    assignedChairId: "chair-1",
  },
];

@Injectable()
export class MembershipsService {
  async getSalonStaff(salonId: string) {
    return MEMBERSHIP_STORE.filter((m) => m.salonId === salonId);
  }

  async getUserMemberships(userId: string) {
    return MEMBERSHIP_STORE.filter((m) => m.userId === userId && m.status === MembershipStatus.ACTIVE);
  }

  async inviteStaff(dto: {
    salonId: string;
    staffEmail: string;
    staffName: string;
    assignedChairId?: string;
  }) {
    const existing = MEMBERSHIP_STORE.find(
      (m) => m.salonId === dto.salonId && m.userEmail === dto.staffEmail
    );
    if (existing) {
      throw new BadRequestException("Staff member is already invited or registered to this salon.");
    }

    const newMembership: MembershipRecord = {
      id: "mem-" + Date.now(),
      userId: "usr-" + Date.now(),
      userEmail: dto.staffEmail,
      userName: dto.staffName,
      salonId: dto.salonId,
      salonName: "Lakmé Salon",
      role: MembershipRole.STAFF,
      status: MembershipStatus.ACTIVE,
      assignedChairId: dto.assignedChairId,
    };

    MEMBERSHIP_STORE.push(newMembership);
    return {
      success: true,
      membership: newMembership,
      message: `Invitation dispatched to ${dto.staffEmail}.`,
    };
  }

  async assignChair(membershipId: string, chairId: string) {
    const member = MEMBERSHIP_STORE.find((m) => m.id === membershipId);
    if (!member) throw new NotFoundException(`Membership '${membershipId}' not found`);

    member.assignedChairId = chairId;
    return {
      success: true,
      membership: member,
      message: `Assigned ${member.userName} to ${chairId}.`,
    };
  }
}

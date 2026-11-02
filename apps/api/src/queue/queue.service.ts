import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { QueueStatus, ChairStatus } from "@snepr/shared-types";

export interface TokenItem {
  id: string;
  tokenNumber: number;
  tokenDisplay: string;
  salonId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  status: QueueStatus;
  isWalkIn: boolean;
  serviceNames: string[];
  totalPrice: number;
  estimatedWaitMinutes: number;
  assignedChairId?: string;
  joinedAt: Date;
  calledAt?: Date;
  serviceStartedAt?: Date;
  completedAt?: Date;
}

const LIVE_TOKENS: TokenItem[] = [
  {
    id: "tok-001",
    tokenNumber: 14,
    tokenDisplay: "A-14",
    salonId: "1",
    customerId: "demo-cust-001",
    customerName: "Ankit Mohapatra",
    customerPhone: "+919876543210",
    status: QueueStatus.WAITING,
    isWalkIn: false,
    serviceNames: ["Signature Haircut & Style"],
    totalPrice: 200,
    estimatedWaitMinutes: 8,
    assignedChairId: "chair-1",
    joinedAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "tok-002",
    tokenNumber: 15,
    tokenDisplay: "A-15",
    salonId: "1",
    customerName: "Rajesh Panda",
    customerPhone: "+919861000000",
    status: QueueStatus.WAITING,
    isWalkIn: true,
    serviceNames: ["Beard Sculpt & Shave"],
    totalPrice: 120,
    estimatedWaitMinutes: 22,
    joinedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
];

@Injectable()
export class QueueService {
  async getSalonQueue(salonId: string) {
    return LIVE_TOKENS.filter((t) => t.salonId === salonId);
  }

  async getToken(tokenId: string) {
    const token = LIVE_TOKENS.find((t) => t.id === tokenId || t.tokenDisplay === tokenId);
    if (!token) throw new NotFoundException(`Token '${tokenId}' not found`);
    return token;
  }

  async joinQueue(dto: {
    salonId: string;
    customerName: string;
    customerPhone: string;
    serviceNames?: string[];
    userId?: string;
  }) {
    const nextNum = LIVE_TOKENS.length + 14;
    const tokenDisplay = `A-${nextNum}`;

    const newToken: TokenItem = {
      id: "tok-" + Date.now(),
      tokenNumber: nextNum,
      tokenDisplay,
      salonId: dto.salonId,
      customerId: dto.userId || "guest",
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      status: QueueStatus.WAITING,
      isWalkIn: false,
      serviceNames: dto.serviceNames || ["Signature Haircut & Style"],
      totalPrice: 200,
      estimatedWaitMinutes: 15,
      joinedAt: new Date(),
    };

    LIVE_TOKENS.push(newToken);
    return {
      success: true,
      token: newToken,
      message: `Token ${tokenDisplay} generated. Your live queue position is #${LIVE_TOKENS.length}.`,
    };
  }

  async createWalkIn(dto: {
    salonId: string;
    customerName: string;
    customerPhone?: string;
    serviceNames?: string[];
    assignedChairId?: string;
  }) {
    const nextNum = LIVE_TOKENS.length + 14;
    const tokenDisplay = `W-${nextNum}`;

    const newToken: TokenItem = {
      id: "tok-" + Date.now(),
      tokenNumber: nextNum,
      tokenDisplay,
      salonId: dto.salonId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone || "Walk-in Desk",
      status: QueueStatus.WAITING,
      isWalkIn: true,
      serviceNames: dto.serviceNames || ["Quick Trim"],
      totalPrice: 150,
      estimatedWaitMinutes: 5,
      assignedChairId: dto.assignedChairId,
      joinedAt: new Date(),
    };

    LIVE_TOKENS.push(newToken);
    return {
      success: true,
      token: newToken,
      message: `Walk-in token ${tokenDisplay} admitted.`,
    };
  }

  async callNext(salonId: string, chairId?: string) {
    const waitingToken = LIVE_TOKENS.find(
      (t) => t.salonId === salonId && t.status === QueueStatus.WAITING
    );

    if (!waitingToken) {
      throw new BadRequestException("No customers currently waiting in queue.");
    }

    waitingToken.status = QueueStatus.CALLED;
    waitingToken.calledAt = new Date();
    if (chairId) waitingToken.assignedChairId = chairId;

    return {
      success: true,
      token: waitingToken,
      message: `Called token ${waitingToken.tokenDisplay} for service.`,
    };
  }

  async startService(tokenId: string) {
    const token = await this.getToken(tokenId);
    token.status = QueueStatus.IN_SERVICE;
    token.serviceStartedAt = new Date();

    return {
      success: true,
      token,
      message: `Service started for token ${token.tokenDisplay}.`,
    };
  }

  async completeService(tokenId: string) {
    const token = await this.getToken(tokenId);
    token.status = QueueStatus.COMPLETED;
    token.completedAt = new Date();

    return {
      success: true,
      token,
      pointsAwarded: 10,
      message: `Service completed for token ${token.tokenDisplay}. +10 Snepr Points credited to customer.`,
    };
  }

  async cancelToken(tokenId: string, reason?: string) {
    const token = await this.getToken(tokenId);
    token.status = QueueStatus.CANCELLED;

    return {
      success: true,
      token,
      message: `Token ${token.tokenDisplay} cancelled.`,
    };
  }
}

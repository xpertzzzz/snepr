import { Injectable, NotFoundException } from "@nestjs/common";
import { ChairStatus } from "@snepr/shared-types";

export interface ChairTelemetry {
  id: string;
  salonId: string;
  chairNumber: number;
  name: string;
  barberName: string;
  status: ChairStatus;
  currentService?: string;
  currentTokenDisplay?: string;
  minutesRemaining?: number;
}

const CHAIR_REGISTRY: Record<string, ChairTelemetry[]> = {
  "1": [
    {
      id: "chair-1",
      salonId: "1",
      chairNumber: 1,
      name: "Chair 01",
      barberName: "Sameer Mohanty",
      status: ChairStatus.AVAILABLE,
    },
    {
      id: "chair-2",
      salonId: "1",
      chairNumber: 2,
      name: "Chair 02",
      barberName: "Rahul Sen",
      status: ChairStatus.OCCUPIED,
      currentService: "Fade & Beard Sculpt",
      currentTokenDisplay: "A-12",
      minutesRemaining: 12,
    },
    {
      id: "chair-3",
      salonId: "1",
      chairNumber: 3,
      name: "Chair 03",
      barberName: "Sunita Jena",
      status: ChairStatus.FINISHING,
      currentService: "Hair Spa",
      currentTokenDisplay: "A-13",
      minutesRemaining: 4,
    },
    {
      id: "chair-4",
      salonId: "1",
      chairNumber: 4,
      name: "Chair 04",
      barberName: "Pooja Das",
      status: ChairStatus.AVAILABLE,
    },
  ],
};

@Injectable()
export class ChairsService {
  async getSalonChairs(salonId: string) {
    return CHAIR_REGISTRY[salonId] || [
      {
        id: `chair-${salonId}-1`,
        salonId,
        chairNumber: 1,
        name: "Chair 01",
        barberName: "Primary Stylist",
        status: ChairStatus.AVAILABLE,
      },
    ];
  }

  async updateChairStatus(chairId: string, status: ChairStatus, minutesRemaining?: number) {
    for (const sId of Object.keys(CHAIR_REGISTRY)) {
      const chair = CHAIR_REGISTRY[sId].find((c) => c.id === chairId);
      if (chair) {
        chair.status = status;
        if (minutesRemaining !== undefined) chair.minutesRemaining = minutesRemaining;
        return {
          success: true,
          chair,
          message: `${chair.name} status updated to ${status}.`,
        };
      }
    }

    throw new NotFoundException(`Chair '${chairId}' not found`);
  }
}

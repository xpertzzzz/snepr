import { Controller, Get, Put, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ChairsService } from "./chairs.service";
import { ChairStatus } from "@snepr/shared-types";

@ApiTags("Chair Telemetry & Station Management")
@Controller("api/chairs")
export class ChairsController {
  constructor(private readonly chairsService: ChairsService) {}

  @Get("salon/:salonId")
  @ApiOperation({ summary: "Get all styling chairs and live status for a salon" })
  async getChairs(@Param("salonId") salonId: string) {
    return this.chairsService.getSalonChairs(salonId);
  }

  @Put(":id/status")
  @ApiOperation({ summary: "Update chair operational status (AVAILABLE, OCCUPIED, FINISHING, BREAK, OFFLINE)" })
  async updateStatus(
    @Param("id") id: string,
    @Body() body: { status: ChairStatus; minutesRemaining?: number }
  ) {
    return this.chairsService.updateChairStatus(id, body.status, body.minutesRemaining);
  }
}

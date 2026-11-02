import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AdminService } from "./admin.service";

@ApiTags("Snepr Admin Console")
@Controller("api/admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("claims")
  @ApiOperation({ summary: "List all pending salon ownership claim applications" })
  async getClaims() {
    return this.adminService.getPendingClaims();
  }

  @Post("claims/:id/review")
  @ApiOperation({ summary: "Approve or reject a salon ownership claim" })
  async reviewClaim(
    @Param("id") id: string,
    @Body() body: { approved: boolean; notes?: string }
  ) {
    return this.adminService.reviewClaim(id, body.approved, body.notes);
  }

  @Get("metrics")
  @ApiOperation({ summary: "Get platform-wide operational and financial metrics" })
  async getMetrics() {
    return this.adminService.getPlatformMetrics();
  }
}


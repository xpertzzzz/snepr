import { Controller, Get, Post, Put, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MembershipsService } from "./memberships.service";

@ApiTags("Salon Memberships & Staff Roles")
@Controller("api/memberships")
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get("salon/:salonId/staff")
  @ApiOperation({ summary: "Get all staff and team members for a salon" })
  async getSalonStaff(@Param("salonId") salonId: string) {
    return this.membershipsService.getSalonStaff(salonId);
  }

  @Post("invite")
  @ApiOperation({ summary: "Invite new staff member to salon" })
  async inviteStaff(@Body() body: any) {
    return this.membershipsService.inviteStaff(body);
  }

  @Put(":id/assign-chair")
  @ApiOperation({ summary: "Assign a staff member to a styling chair" })
  async assignChair(@Param("id") id: string, @Body() body: { chairId: string }) {
    return this.membershipsService.assignChair(id, body.chairId);
  }
}


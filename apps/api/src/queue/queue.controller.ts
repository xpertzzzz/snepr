import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { QueueService } from "./queue.service";

@ApiTags("Live Queue Operations")
@Controller("api/queue")
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get("salon/:salonId")
  @ApiOperation({ summary: "Get live queue tokens for a salon" })
  async getSalonQueue(@Param("salonId") salonId: string) {
    return this.queueService.getSalonQueue(salonId);
  }

  @Get("token/:id")
  @ApiOperation({ summary: "Get status of a specific queue token" })
  async getToken(@Param("id") id: string) {
    return this.queueService.getToken(id);
  }

  @Post("join")
  @ApiOperation({ summary: "Customer joins virtual queue" })
  async join(@Body() body: any) {
    return this.queueService.joinQueue(body);
  }

  @Post("walk-in")
  @ApiOperation({ summary: "Salon desk / staff logs a walk-in client" })
  async walkIn(@Body() body: any) {
    return this.queueService.createWalkIn(body);
  }

  @Post("call-next")
  @ApiOperation({ summary: "Call the next waiting customer" })
  async callNext(@Body() body: { salonId: string; chairId?: string }) {
    return this.queueService.callNext(body.salonId, body.chairId);
  }

  @Put("token/:id/start")
  @ApiOperation({ summary: "Mark service as started" })
  async startService(@Param("id") id: string) {
    return this.queueService.startService(id);
  }

  @Put("token/:id/complete")
  @ApiOperation({ summary: "Mark service as completed and award loyalty points" })
  async completeService(@Param("id") id: string) {
    return this.queueService.completeService(id);
  }

  @Put("token/:id/cancel")
  @ApiOperation({ summary: "Cancel a queue token" })
  async cancelToken(@Param("id") id: string, @Body() body: { reason?: string }) {
    return this.queueService.cancelToken(id, body?.reason);
  }
}


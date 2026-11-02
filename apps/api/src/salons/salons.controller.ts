import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { SalonsService } from "./salons.service";

@ApiTags("Salons Discovery & Management")
@Controller("api/salons")
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Get()
  @ApiOperation({ summary: "Get all partner salons with locality filter and text search" })
  @ApiQuery({ name: "locality", required: false })
  @ApiQuery({ name: "q", required: false })
  async getAll(@Query("locality") locality?: string, @Query("q") q?: string) {
    return this.salonsService.findAll(locality, q);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get detailed salon profile, chairs, and services" })
  async getById(@Param("id") id: string) {
    return this.salonsService.findById(id);
  }

  @Post("register")
  @ApiOperation({ summary: "Register a new salon on Snepr" })
  async register(@Body() body: any) {
    return this.salonsService.registerSalon(body);
  }

  @Post("claim")
  @ApiOperation({ summary: "Submit an ownership claim for an unverified salon" })
  async claim(@Body() body: any) {
    return this.salonsService.submitClaim(body);
  }
}

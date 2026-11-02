import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SupabaseAuthGuard } from "./supabase-auth.guard";

@ApiTags("Authentication")
@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login with email and password (supports demo credentials)" })
  async login(@Body() body: { email: string; pass: string }) {
    return this.authService.loginWithPassword(body.email, body.pass);
  }

  @Post("otp/send")
  @ApiOperation({ summary: "Dispatch OTP code to mobile phone" })
  async sendOtp(@Body() body: { phone: string }) {
    return this.authService.sendOtp(body.phone);
  }

  @Post("otp/verify")
  @ApiOperation({ summary: "Verify OTP code and issue JWT session token" })
  async verifyOtp(@Body() body: { phone: string; otp: string }) {
    return this.authService.verifyOtp(body.phone, body.otp);
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: "Retrieve authenticated user profile and memberships" })
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}


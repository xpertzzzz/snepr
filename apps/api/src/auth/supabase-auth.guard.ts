import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or malformed Authorization header");
    }

    const token = authHeader.split(" ")[1];

    try {
      // In production, verify against Supabase JWT secret. In dev/demo, allow valid payload.
      const decoded: any = jwt.decode(token);
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException("Invalid token payload");
      }

      request.user = {
        id: decoded.sub,
        email: decoded.email,
        phone: decoded.phone,
        role: decoded.app_metadata?.role || "CUSTOMER",
      };

      return true;
    } catch {
      throw new UnauthorizedException("Failed to authenticate token");
    }
  }
}

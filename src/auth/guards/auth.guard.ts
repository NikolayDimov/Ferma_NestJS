// From NestJS Documentation
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorator/public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // console.log("request:", request);

    const token = this.extractTokenFromHeader(request);
    // console.log("auth-guard-token:", token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  // By Documentation
  // private extractTokenFromHeader(request: Request): string | undefined {
  //     const [type, token] = request.headers.authorization?.split(" ") ?? [];
  //     console.log("Authorization Type:", type);
  //     console.log("Token:", token);
  //     return type === "Bearer" ? token : undefined;
  // }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    // console.log("Authorization Header:", authHeader);

    if (authHeader && typeof authHeader === "string") {
      const [type, token] = authHeader.split(" ");

      if (type === "Bearer" && token) {
        return token;
      }
    }

    return undefined;
  }
}

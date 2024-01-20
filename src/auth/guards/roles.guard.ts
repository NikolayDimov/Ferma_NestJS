import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../dtos/role.enum";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // console.log("user:", user);

    if (!user) {
      console.log("User object not found in request.");
      return false;
    }

    // NestJs documenttion
    // return requiredRoles.some((role) => user.roles?.includes(role));
    const hasRequiredRole = requiredRoles.includes(user.role);
    // console.log("hasRequiredRole:", hasRequiredRole);

    if (!hasRequiredRole) {
      console.log(`User does not have the required role: ${requiredRoles}`);
    }

    return hasRequiredRole;
  }
}

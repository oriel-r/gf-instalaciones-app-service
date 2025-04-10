import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles/roles.decorator';
  
  @Injectable()
  export class RoleEnabledGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // si no se requiere rol, se permite
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) return false;
  
      for (const role of requiredRoles) {
        switch (role) {
          case 'installer':
            if (user.installer?.disabledAt === null) return true;
            break;
          case 'coordinator':
            if (user.coordinator?.disabledAt === null) return true;
            break;
          case 'user':
            if (user.disabledAt === null) return true;
            break;
        }
      }
  
      throw new ForbiddenException('Tu rol está deshabilitado');
    }
  }
  
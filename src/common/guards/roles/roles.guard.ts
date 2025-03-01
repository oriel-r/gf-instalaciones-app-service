import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos desde los metadatos del controlador
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Obtener el usuario desde la solicitud

    if (!user || !user.role) {
      throw new UnauthorizedException('No tienes los permisos adecuados.');
    }

    // Verificar si el rol del usuario coincide con los roles requeridos
    const hasRole = requiredRoles.some((role) => role === user.role.name);

    if (!hasRole) {
      throw new UnauthorizedException('No tienes los permisos adecuados.');
    }

    return true;
  }
}


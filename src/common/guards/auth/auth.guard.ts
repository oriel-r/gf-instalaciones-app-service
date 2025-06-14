import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no encontrado.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request['user'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token no válido.');
    }
  }

  private extractTokenFromHeader(request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const [type, token] = authorizationHeader?.split(' ') ?? [];


    if (type === 'Bearer' && token) {
      const aToken = token.replace(/^['"]|['"]$/g, '');
      return aToken;
    }

    return undefined;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no encontrado.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
        relations: ['userRoles', 'userRoles.role', 'installer', 'coordinator'],
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      request['user'] = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token no válido.');
    }
  }

  private extractTokenFromHeader(request: Request) {
    const authorizationHeader = request.headers['authorization'];
    const [type, token] = authorizationHeader?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      return token.replace(/^['"]|['"]$/g, '');
    }

    return undefined;
  }
}

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class BatchKeyGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const key = req.headers['x-batch-key'] || req.headers['x-api-key'];

    if (key === process.env.BATCH_LOAD_KEY) return true;

    throw new UnauthorizedException('Clave de lote inválida');
  }
}
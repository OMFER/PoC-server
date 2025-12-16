import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../common/rol.enums';
import { log } from 'node:console';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector, private readonly jwtService: JwtService, private readonly config: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!role) {
      return true
    }
    const request = context.switchToHttp().getRequest()

    const token = this.extractTokenFromHeader(request)
    if (!token) throw new UnauthorizedException()
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.config.get("JWT_SECRET")
        }
      );

      return payload.rol.includes(role)
    } catch (e) {
      console.log("error", e);
      throw new UnauthorizedException()
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}

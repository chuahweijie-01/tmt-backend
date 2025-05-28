import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const cookies = req.cookies as Record<string, string> | undefined;
          return cookies?.token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY!,
    });
  }

  validate(payload: { sub: string; username: string }) {
    return { userId: payload.sub, username: payload.username };
  }
}

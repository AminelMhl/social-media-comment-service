import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  private get jwtSecret(): string {
    return process.env.JWT_SECRET || 'supersecretjwt';
  }

  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}


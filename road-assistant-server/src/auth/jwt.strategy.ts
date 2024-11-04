import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';

import { TokenPayload } from '@/auth/interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get<string>(
          'auth.domain',
        )}/.well-known/jwks.json`,
      }),

      jwtFromRequest: (request) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        return token;
      },
      audience: configService.get<string>('auth.audience'),
      issuer: `https://${configService.get<string>('auth.domain')}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: TokenPayload): TokenPayload {
    const minimumScope = ['openid', 'profile', 'email'];

    const scopes = payload?.scope.split(' ');
    if (scopes && !minimumScope.every((scope) => scopes.includes(scope))) {
      throw new UnauthorizedException(
        'JWT does not possess the required scope',
      );
    }

    return { auth0Id: payload.sub };
  }
}

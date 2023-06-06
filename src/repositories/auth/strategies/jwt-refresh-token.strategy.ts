import { Injectable, Request, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/services/users.service';
import { AuthValidationPayloadInterface } from '../interfaces/auth-validation-payload.interface';
import { UserDocument } from '../../users/schemas/user.schema';
import { ENV_CONFIGS } from '../../../configs/configuration';
import { UserInterface } from '../../../interfaces/user.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('accessToken'),
      ignoreExpiration: true,
      secretOrKey: configService.get(ENV_CONFIGS.JWT_SECRET),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: AuthValidationPayloadInterface,
  ): Promise<AuthValidationPayloadInterface> {
    const userDocument: UserDocument = await this.usersService.findByUUID(
      payload.uuid,
    );

    if (!userDocument) {
      throw new UnauthorizedException('No refresh token found');
    }

    if (
      (request.body as UserInterface).refreshToken !=
      (await userDocument).refreshToken
    ) {
      throw new UnauthorizedException('Refresh token does not matched');
    }

    if (new Date() > new Date((await userDocument).refreshTokenExpiresIn)) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return { uuid: payload.uuid, email: userDocument.email };
  }
}

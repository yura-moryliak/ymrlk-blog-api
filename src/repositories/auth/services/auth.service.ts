import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';
import { generate } from 'rand-token';

import { UsersService } from '../../users/services/users.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { AuthTokenRequestPayloadInterface } from '../interfaces/auth-token-request-payload.interface';
import { AuthTokensInterface } from '../interfaces/auth-tokens.interface';

import { ENV_CONFIGS } from '../../../configs/configuration';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const userDocument: UserDocument = await this.usersService.findOne(email);

    if (!userDocument) {
      return null;
    }

    const arePasswordsSame = await compare(password, userDocument.password);

    if (userDocument && arePasswordsSame) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = userDocument;
      return result as UserDocument;
    }
  }

  async login(
    loginPayload: AuthTokenRequestPayloadInterface,
  ): Promise<AuthTokensInterface> {
    return {
      accessToken: this.jwtService.sign(loginPayload.user),
      refreshToken: await this.generateRefreshToken(loginPayload.user.uuid),
    };
  }

  private async generateRefreshToken(userUUID: string): Promise<string> {
    const refreshToken = generate(
      this.configService.get(ENV_CONFIGS.REFRESH_TOKEN_SIZE),
    );

    // Production variant
    const expirationDate = new Date();

    expirationDate.setDate(
      expirationDate.getDate() +
        +this.configService.get(ENV_CONFIGS.REFRESH_TOKEN_EXPIRATION_DAYS),
    );

    // 3 Minutes for Testings
    // const expirationDate = new Date();
    // expirationDate.setMinutes(expirationDate.getMinutes() + 3);

    await this.usersService.saveOrUpdateRefreshToken(
      userUUID,
      refreshToken,
      expirationDate,
    );

    return refreshToken;
  }
}

import { Controller, Post, UseGuards, Request, HttpCode } from '@nestjs/common';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

import { AuthTokenRequestPayloadInterface } from '../interfaces/auth-token-request-payload.interface';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { SkipJwtCheck } from '../../../decorators/skip-jwt-check.decorator';
import { UserInterface } from '../../../interfaces/user.interface';
import { AuthTokensInterface } from '../interfaces/auth-tokens.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @SkipJwtCheck()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: any): Promise<AuthTokensInterface> {
    const { email, uuid } = request.user._doc as UserInterface;
    return this.authService.login({ user: { email, uuid: uuid } });
  }

  @HttpCode(200)
  @SkipJwtCheck()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req: AuthTokenRequestPayloadInterface) {
    return await this.authService.login(req);
  }
}

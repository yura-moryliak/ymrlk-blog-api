import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../../users/services/users.service';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(userName: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(userName);

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}

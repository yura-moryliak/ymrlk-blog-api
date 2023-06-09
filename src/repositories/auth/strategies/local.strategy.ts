import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../services/auth.service';
import { UserDocument } from '../../users/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<UserDocument> {
    const contextId: ContextId = ContextIdFactory.getByRequest(request);
    const authService: AuthService = await this.moduleRef.resolve(
      AuthService,
      contextId,
    );

    const userDocument: UserDocument = await authService.validateUser(
      email,
      password,
    );

    if (!userDocument) {
      throw new HttpException('User was not found', HttpStatus.NOT_FOUND);
    }

    return userDocument;
  }
}

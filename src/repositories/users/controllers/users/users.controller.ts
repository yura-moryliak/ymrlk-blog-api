import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SkipJwtCheck } from '../../../../decorators/skip-jwt-check.decorator';
import { UsersService } from '../../services/users.service';
import { UserDocument } from '../../schemas/user.schema';
import { Roles } from '../../../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserInterface } from '../../../../interfaces/user.interface';
import { RoleEnum } from '../../../../roles/roles.enum';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('email/:email')
  async getByEmail(@Param() email: { email: string }): Promise<UserDocument> {
    const userDocument = await this.usersService.findByEmail(email.email);

    if (!userDocument) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `User with ${email.email} email was not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return userDocument;
  }

  @Get('uuid/:uuid')
  async getByUUID(@Param() uuid: { uuid: string }): Promise<UserDocument> {
    const userDocument = await this.usersService.findByUUID(uuid.uuid);

    if (!userDocument) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `User with ${uuid.uuid} was not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return userDocument;
  }

  @HttpCode(200)
  @SkipJwtCheck()
  @Post('register')
  async createOne(@Body() model: UserInterface): Promise<UserDocument> {
    const userDocument = await this.usersService.createOne(model);

    if (userDocument) {
      return userDocument;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @HttpCode(200)
  @Post('remove-user')
  @Roles(RoleEnum.Admin)
  addRole(@Body() uuid: { uuid: string }): any {
    return uuid;
  }
}

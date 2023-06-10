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
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserInterface } from '../../../../interfaces/user.interface';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req): Promise<any> {
    return req.user;
  }

  @Get('email/:email')
  async getByEmail(@Param() email: { email: string }): Promise<UserDocument> {
    const userDocument = await this.usersService.findByEmail(email.email);

    if (!userDocument) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `User with ${email.email} email was not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return userDocument;
  }

  @UseGuards(JwtAuthGuard)
  @Get('uuid/:uuid')
  async getByUUID(@Param() uuid: { uuid: string }): Promise<UserDocument> {
    const userDocument = await this.usersService.findByUUID(uuid.uuid);

    if (!userDocument) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `User with ${uuid.uuid} was not found`,
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
          message: 'User already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // @HttpCode(200)
  // @Post('remove-user')
  // @Roles(RoleEnum.Admin)
  // addRole(@Body() uuid: { uuid: string }): any {
  //   return uuid;
  // }
}

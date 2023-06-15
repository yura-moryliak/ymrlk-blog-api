import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { diskStorage } from 'multer';
import * as fs from 'fs';

import { SkipJwtCheck } from '../../../../decorators/skip-jwt-check.decorator';
import { UsersService } from '../../services/users.service';
import { UserDocument } from '../../schemas/user.schema';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserInterface } from '../../../../interfaces/user.interface';
import { ENV_CONFIGS } from '../../../../configs/configuration';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

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

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Put('profile/update')
  async updateProfile(
    @Body() body: { uuid: string; model: Partial<UserInterface> },
  ): Promise<UserDocument> {
    return this.usersService.updateProfile(body);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Put('profile/update-social-profiles')
  async updateSocialProfile(
    @Body() body: { uuid: string; model: Partial<UserInterface> },
  ): Promise<UserDocument> {
    return this.usersService.updateSocialProfiles(body);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('profile/upload-avatar')
  @UseInterceptors(
    // TODO Technical afford
    // TODO Provide here rewrite file to avoid new image files creation
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename(
          req: any,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ): void {
          const extension = file.originalname.split('.').pop();
          callback(null, `${Date.now()}.${extension}`);
        },
      }),
      limits: { fileSize: 3000000 },
    }),
  )
  async uploadProfileAvatar(@UploadedFile() file: Express.Multer.File, @Body() body: { uuid: string }): Promise<UserDocument> {
    const avatarSrc = file ? `${this.configService.get(ENV_CONFIGS.BASE_URL)}/uploads/${file.filename}` : '';
    return this.usersService.updateProfileAvatarPath(body.uuid, avatarSrc);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('profile/delete-avatar')
  async deleteProfileAvatar(@Body() body: { uuid: string, fileName: string }): Promise<UserDocument> {
    const files: string[] = fs.readdirSync('uploads');

    if (files.includes(body.fileName)) {
      fs.unlinkSync(`uploads/${body.fileName}`);
    }

    return this.uploadProfileAvatar(null, { uuid: body.uuid });
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Put('profile/change-password')
  async changeUserPassword(@Body() body: { uuid: string, oldPassword: string, newPassword: string }): Promise<boolean> {
    return this.usersService.changePassword(body);
  }

  // @HttpCode(200)
  // @Post('remove-user')
  // @Roles(RoleEnum.Admin)
  // addRole(@Body() uuid: { uuid: string }): any {
  //   return uuid;
  // }
}

import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { hash, compare } from 'bcrypt';
import { v1 as uuidv1 } from 'uuid';

import { User, UserDocument } from '../schemas/user.schema';
import { UserInterface } from '../../../interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<UserDocument> {
    const foundUserDocument = await this.userModel.findOne({ email }).exec();

    if (!foundUserDocument) {
      return null;
    }

    return foundUserDocument;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const foundUserDocument = await this.userModel
      .findOne({ email })
      .select('-password')
      .exec();

    if (!foundUserDocument) {
      return null;
    }

    return foundUserDocument;
  }

  async findByUUID(uuid: string): Promise<UserDocument> {
    const foundUserDocument = await this.userModel
      .findOne({ uuid })
      .select('-password')
      .select('-_id')
      .select('-__v')
      .select('-refreshToken')
      .select('-refreshTokenExpiresIn')
      .exec();

    if (!foundUserDocument) {
      return null;
    }

    return foundUserDocument;
  }

  async findBySubdomain(subdomain: string): Promise<UserDocument> {
    const foundUserDocument = await this.userModel
      .findOne({ subdomain: subdomain })
      .select('-password')
      .select('-_id')
      .select('-__v')
      .select('-refreshToken')
      .select('-refreshTokenExpiresIn')
      .exec();

    if (!foundUserDocument) {
      return null;
    }

    return foundUserDocument;
  }

  async createOne(model: UserInterface): Promise<any> {
    const userExist = await this.findByEmail(model.email);

    if (!userExist) {
      return this.getCreatedDocument(model);
    }

    return false;
  }

  async saveOrUpdateRefreshToken(
    uuid: string,
    refreshToken: string,
    refreshTokenExpiresIn: Date,
  ): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { uuid },
      {
        refreshToken,
        refreshTokenExpiresIn,
      },
    );
  }

  async updateProfile(body: {
    uuid: string;
    model: Partial<UserInterface>;
  }): Promise<UserDocument> {
    const result = await this.userModel
      .findOneAndUpdate({ uuid: body.uuid }, { ...body.model }, { new: true })
      .select('-password')
      .select('-_id')
      .select('-__v')
      .select('-refreshToken')
      .select('-refreshTokenExpiresIn');

    return result as UserDocument;
  }

  async updateSocialProfiles(body: {
    uuid: string;
    model: Partial<UserInterface>;
  }): Promise<UserDocument> {
    const result = await this.userModel
      .findOneAndUpdate(
        { uuid: body.uuid },
        { socialProfiles: body.model },
        { new: true },
      )
      .select('-password')
      .select('-_id')
      .select('-__v')
      .select('-refreshToken')
      .select('-refreshTokenExpiresIn');

    return result as UserDocument;
  }

  async updateProfileAvatarPath(
    uuid: string,
    avatarSrc: string,
  ): Promise<UserDocument> {
    const result = await this.userModel
      .findOneAndUpdate({ uuid: uuid }, { avatarSrc }, { new: true })
      .select('-password')
      .select('-_id')
      .select('-__v')
      .select('-refreshToken')
      .select('-refreshTokenExpiresIn');

    return result as UserDocument;
  }

  async changePassword(body: {
    uuid: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<boolean> {
    const user: UserDocument = await this.userModel.findOne({
      uuid: body.uuid,
    });

    const passwordsMatch = await compare(body.oldPassword, user.password);

    if (!passwordsMatch) {
      return false;
    }

    const updatedResult = await this.userModel.findOneAndUpdate(
      { uuid: body.uuid },
      { password: await this.hashPassword(body.newPassword) },
      { new: true },
    );

    return !!updatedResult;
  }

  private async getCreatedDocument(model): Promise<any> {
    model.subdomain = model.email.split('@')[0];
    const modelCopy = {
      ...model,
      password: await this.hashPassword(model.password),
      uuid: uuidv1(),
    };

    const user = await new this.userModel(modelCopy).save();

    if (user) {
      return true;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}

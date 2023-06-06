import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { hash } from 'bcrypt';
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

  private async getCreatedDocument(model): Promise<any> {
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

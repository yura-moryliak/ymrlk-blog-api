import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ type: String, maxlength: 50 })
  firstName: string;

  @Prop({ type: String, maxlength: 50 })
  lastName: string;

  @Prop({ type: String })
  avatarSrc: string;

  @Prop({ type: String, maxlength: 50 })
  subdomain: string;

  @Prop({ type: String, maxlength: 250 })
  bio: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true, unique: true })
  uuid: string;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: Date })
  refreshTokenExpiresIn: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
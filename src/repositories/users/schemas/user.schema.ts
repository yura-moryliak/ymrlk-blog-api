import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, maxlength: 50 })
  userName: string;

  @Prop({ type: String, maxlength: 50 })
  firstName: string;

  @Prop({ type: String, maxlength: 50 })
  lastName: string;

  @Prop({ type: String, maxlength: 250 })
  shortBio: string;

  @Prop(
    raw({
      name: { type: String },
      path: { type: String },
    }),
  )
  avatar: Record<string, any>;

  @Prop(
    raw({
      url: { type: String },
      prefix: { type: String },
    }),
  )
  accountUrl: Record<string, any>;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop(
    raw({
      country: { type: String },
      city: { type: String },
    }),
  )
  from: Record<string, any>;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop({ type: String, required: true, unique: true })
  uuid: string;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: Date })
  refreshTokenExpiresIn: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, enum: ['local', 'google'], default: 'local' })
  provider: string;

  @Prop()
  providerId: string;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  resetPasswordOtp?: string;

  @Prop({ required: false })
  resetPasswordOtpExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  stock: number;

  @Prop({ type: String, required: false })
  category?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

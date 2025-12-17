import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/rol.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({type: String, default: Role.USER, enum: Object.values(Role)})
  rol: string;

  @Prop({ default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
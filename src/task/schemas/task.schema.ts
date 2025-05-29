import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@user/schemas/user.schema';
import { Document, Types } from 'mongoose';

export type BaseTaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  deadlineDate: string;
  @Prop()
  description: string;
  @Prop()
  isCompleted: boolean;
  @Prop()
  isPriority: boolean;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

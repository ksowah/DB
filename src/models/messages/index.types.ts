import type { Document, Types } from "mongoose";

export interface IMessage {
  user: Types.ObjectId
  chatId: Types.ObjectId
  prompt: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends Document, IMessage {}
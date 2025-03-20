import type { Document, Types } from "mongoose";

export interface IChat {
  code: string;
  name: string;
  createdBy: Types.ObjectId
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatDocument extends Document, IChat {}
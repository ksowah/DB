import type { Document } from "mongoose";

export interface IUser {
  code: string;
  fullName: string;
  emailAddress: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Document, IUser {}
import type { Document, Types } from "mongoose";

export interface IProject {
  code: string;
  name: string;
  description: string;
  AIResponse: string;
  createdBy: Types.ObjectId
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends Document, IProject {}
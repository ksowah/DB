import { model, Schema, SchemaTypes } from "mongoose";
import { IProjectDocument } from "./index.types";

export const ProjectSchema = new Schema<IProjectDocument>(
  {
    code: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    name:{
      type: SchemaTypes.String, 
      required: true,
    },
    description:{
      type: SchemaTypes.String,
      required: true,
    },
    AIResponse:{
      type: SchemaTypes.String,
      required: false,
    },
    createdBy: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);


export const ProjectModel = model<IProjectDocument>("Project", ProjectSchema);
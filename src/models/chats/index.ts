import { model, Schema, SchemaTypes } from "mongoose";
import { IChatDocument } from "./index.types";

export const ChatSchema = new Schema<IChatDocument>(
  {
    name:{
      type: SchemaTypes.String, 
      required: true,
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


export const ChatModel = model<IChatDocument>("Chat", ChatSchema);
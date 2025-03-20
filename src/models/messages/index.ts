import { model, Schema, SchemaTypes } from "mongoose";
import { IMessageDocument } from "./index.types";

export const MessageSchema = new Schema<IMessageDocument>(
  {
    user: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
    prompt:{
      type: SchemaTypes.String, 
      required: true,
    },
    chatId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: "Chat"
    },
    message: {
      type: SchemaTypes.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const MessageModel = model<IMessageDocument>("Message", MessageSchema);
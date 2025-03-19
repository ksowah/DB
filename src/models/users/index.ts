import { model, Schema, SchemaTypes } from "mongoose";
import {  IUser, IUserDocument } from "./index.types";
import bcrypt from "bcrypt";

export const UserSchema = new Schema<IUserDocument>(
  {
    code: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    fullName:{
      type: SchemaTypes.String, 
      required: true,
    },
    emailAddress:{
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    password:{
      type: SchemaTypes.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


UserSchema.pre("save", async function (this: IUserDocument, next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    } catch (err) {
      next(err);
    }
  }
  next();
});
export const UserModel = model<IUserDocument>("User", UserSchema);
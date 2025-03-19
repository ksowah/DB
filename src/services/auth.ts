import { UserModel } from "../models";
import dayjs from "dayjs";
import config from "../config";
import jwt from "jsonwebtoken";
import relativeTime from "dayjs/plugin/relativeTime";
import ms from "ms";
import { IAppContext } from "../context";
import bcrypt from "bcrypt";
dayjs.extend(relativeTime);
import { generateCode } from "../utils";

export async function registerUser(args, ctx: IAppContext) {
  try {
    const newUser = await UserModel.create({
      ...args,
      code: await generateCode("User"),
    });
    return newUser;
  } catch (err) {
    throw err;
  }
}

export async function loginUser(args, ctx: IAppContext) {
  try {
    const existingUser = await UserModel.findOne({
      emailAddress: args.emailAddress,
    });
    if (!existingUser) {
      throw new Error("User not found");
    }
    await _checkPassword(existingUser, args.password);
    await existingUser.save();

    const token = await _setToken(existingUser, "User");
    return {
      user: existingUser,
      token,
    };
  } catch (err) {
    throw err;
  }
}

export async function _generateToken(existingUser) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        type: existingUser.type,
        userId: existingUser._id,
      },
      Buffer.from(config.auth.secret, "base64"),
      {
        audience: config.app.name,
        issuer: config.app.name,
        expiresIn: ms(Number(config.auth.tokenExpiry)),
      },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
}

export async function _setToken(existingUser, type) {
  const authorization = await _generateToken({
    ...existingUser.toJSON(),
    type,
  });
  return authorization;
}

export async function _checkPassword(existingUser, password) {
  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    // Trigger locker event here
    existingUser.locker = {
      tries: (existingUser.locker.tries || 0) + 1,
      expiresAt: dayjs().add(config.auth.lockerExpiry, "milliseconds").toDate(),
    };
    await existingUser.save();
    throw new Error("Password is incorrect");
  }
}

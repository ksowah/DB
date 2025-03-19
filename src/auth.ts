import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import config from "./config";

export async function _resolveAuthorizationToken({ authorizationToken }) {
  try {
    const tokenData: any = await _validateToken(authorizationToken);

    if (!tokenData) {
      throw new GraphQLError("InvalidToken", {
        extensions: {
          code: "UNAUTHENTICATED",
          myExtension: "",
        },
      });
    }

    return tokenData;
  } catch (err) {
    return null;
  }
}

const _validateToken = async (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      Buffer.from(config.auth.secret, "base64"),
      { ignoreNotBefore: true },
      (err, payload) => {
        if (err) {
          reject(
            new GraphQLError("Session Expired", {
              extensions: {
                code: "UNAUTHENTICATED",
                myExtension: "",
              },
            })
          );
        }
        resolve(payload);
      }
    );
  });

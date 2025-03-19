import { GraphQLError } from "graphql";
import lodash from "lodash";

const formatError = (err) => {
  if (err.message.includes("AuthorizationExpired")) {
    return new GraphQLError("AuthorizationExpired", {
      extensions: {
        code: "UNAUTHENTICATED",
        myExtension: "",
      },
    });
  }
  if (err.message.includes("InvalidOrigin")) {
    return new GraphQLError("InvalidOrigin", {
      extensions: {
        code: "FORBIDDEN",
        myExtension: "",
      },
    });
  }
  if (err.message.includes("InvalidToken")) {
    return new GraphQLError("InvalidToken", {
      extensions: {
        code: "UNAUTHENTICATED",
        myExtension: "",
      },
    });
  }
  if (err.message.includes("E11000")) {
    let [collection, fields, data] = err.message
      .replace("E11000 duplicate key error collection: ", "")
      .replaceAll("_1", "")
      .replace(" index: ", "@-@")
      .replace(" dup key: ", "@-@")
      .split("@-@");
    collection = collection.split(".")[1];
    fields = fields.split("_");
    const rawMessage = `There exists ${collection} with ${fields
      .map(
        (field, idx) =>
          `${field}: \${${field}}${
            idx === fields.length - 2
              ? " and "
              : idx === fields.length - 1
              ? ""
              : ", "
          }`
      )
      .join("")}`;
    data = lodash.fromPairs(
      data
        .replaceAll(`"`, "")
        .replace("{ ", "")
        .replace(" }", "")
        .split(", ")
        .map((datum) => datum.split(": "))
    );
    const rawError = lodash.template(rawMessage)(data);
    return new GraphQLError(rawError);
  }
  return err;
};


export class CustomError extends Error {
  code: any;
  constructor(code, message) {
    super(message);
    this.name = this.constructor.name;
    this.code = code
    
    Error.captureStackTrace(this, this.constructor);
  }
}


export default formatError;

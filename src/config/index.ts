import dotenv from "dotenv";
import ms from "ms";

dotenv.config();
const config = {
  app: {
    name: "Database Schema Creation Sys",
  },
  port: parseInt(process.env.PORT || "4000", 10),
  db: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/db_creation",
    database: process.env.MONGODB_DATABASE || "db_creation",
  },
  auth: {
    identity: "Database Schema Creation Sys",
    lockerRetries: 1000,
    lockerExpiry: ms("30 minutes"),
    tokenExpiry: ms("30 days"),
    refreshTokenExpiry: ms("30 days"),
    codeExpiry: ms("5 minutes"),
    secret: process.env.AUTH_SECRET || "this+is+no+secret+at+all",
  },
};
export default config;

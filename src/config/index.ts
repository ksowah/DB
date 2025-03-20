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
  deepseek: {
    key: process.env.DEEPSEEK_KEY || "sk-4169e183a7fd4760a93c4e8a02328232"
  },
  huggingface: {
    key: process.env.HUGGINGFACE_KEY || "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",
    model: "mistralai/Mistral-7B-Instruct-v0.2"
  },
};
export default config;

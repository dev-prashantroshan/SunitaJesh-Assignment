import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "5000",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sunita-jesh-assignment",
  nodeEnv: process.env.NODE_ENV || "development",
};

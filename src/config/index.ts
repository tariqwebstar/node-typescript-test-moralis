import dotenv from "dotenv";

// for development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
  // If no .env file.
  throw new Error("Couldn't find .env file");
}
export default {
  port: process.env.PORT || 3000,
  serverType: process.env.SERVER_TYPE || "express",
};

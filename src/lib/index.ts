import express from "express";
import expressLoader from "./express";
import config from "../config/index";

export default async ({ serverApp }: { serverApp: express.Application }) => {
  await expressLoader({ app: serverApp });
  console.log(`${config.serverType} ready to go!!`);
};

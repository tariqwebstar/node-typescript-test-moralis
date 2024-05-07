import express, { Application } from "express";
import * as libs from "./lib";
import axios from "axios";
import { IOwnerData } from "./interfaces/ITypes";

const API_CONTRACT_ADDRESS: string = process.env.API_CONTRACT_ADDRESS || "";
const API_KEY: string = process.env.API_KEY || "";
const API_URL: string = process.env.API_URL || "";

async function fetchDataWithPagination(
  url: string,
  apiKey: string
): Promise<{ owner_of: string; token_ids: string[] }[]> {
  let cursor: string | null = null;
  const addresses: { owner_of: string; token_ids: string[] }[] = [];

  try {
    while (true) {
      const response = await axios.get(url, {
        headers: {
          "X-API-Key": apiKey,
        },
        params: {
          cursor,
        },
      });

      const result: IOwnerData[] = response.data.result;

      for (const obj of result) {
        const { owner_of, token_id } = obj;

        const addressIndex: number = addresses.findIndex(
          (x) => x.owner_of === owner_of
        );
        if (addressIndex === -1) {
          addresses.push({ owner_of, token_ids: [token_id] });
        } else {
          addresses[addressIndex].token_ids.push(token_id);
        }
      }

      break;
      if (response.data.cursor) {
        cursor = response.data.cursor;
      } else {
        break;
      }
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    throw error;
  }

  return addresses;
}

async function startServer(): Promise<void> {
  const app: Application = express();
  await libs.default({ serverApp: app });

  try {
    const addresses = await fetchDataWithPagination(
      `${API_URL}/nft/${API_CONTRACT_ADDRESS}/owners`,
      API_KEY
    );

    console.log("Fetched addresses:", addresses);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
  }
}

startServer();

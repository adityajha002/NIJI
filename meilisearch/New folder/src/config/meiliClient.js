import dotenv from "dotenv";
dotenv.config();

import { Meilisearch } from "meilisearch";

export const meiliClient = new Meilisearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_MASTER_KEY,
});
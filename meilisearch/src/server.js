import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { meiliClient } from "./config/meiliClient.js";
import { initMeilisearch } from "./config/initIndex.js";

const app = express();

app.get("/health", async (req, res) => {
  try {
    const health = await meiliClient.health();

    res.json({
      service: "Search Service",
      meilisearch: health,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});



initMeilisearch().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Search Service running on port ${process.env.PORT || 3001}`);
  });
});
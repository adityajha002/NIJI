import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { meiliClient } from "./config/meiliClient.js";
import { initMeilisearch } from "./config/initIndex.js";
import { indexAll } from "./services/indexAll.js";
import { reQueue } from "./services/reQueue.js";
import { indexProduct } from "./services/indexProduct.js";
import { searchProducts } from "./services/searchProducts.js";
const app = express();

app.use(express.json()); // needed once, before your routes, to parse JSON bodies

app.post("/index-product", async (req, res) => {
  try {
    await indexProduct(req.body);
    res.json({ status: "indexed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/search", async (req, res) => {
  try {
    const hits = await searchProducts({
      query: req.query.q,
      userLat: req.query.lat ? Number(req.query.lat) : undefined,
      userLng: req.query.lng ? Number(req.query.lng) : undefined,
      radiusMeters: req.query.radius ? Number(req.query.radius) : undefined,
      category: req.query.category,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      sortBy: req.query.sortBy,
    });
    res.json(hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

initMeilisearch()
  .then(() => indexAll())
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Search Service running on port ${process.env.PORT || 3001}`);
    });
    setInterval(reQueue, 5 * 60 * 1000); 
  });
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.json([]);
    }

    const searchUrl = process.env.MEILISEARCH_URL || "http://localhost:3001";
    const response = await fetch(
      `${searchUrl}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Meilisearch error:",
        response.status,
        errorText
      );

      return res.status(500).json({
        message: "Meilisearch search failed",
      });
    }

    const data = await response.json();

    const hits = Array.isArray(data) ? data : data.hits || [];

    const results = hits.map((product) => ({
      product_id: product.product_id,
      name: product.name,
      image_url: product.image_url,
      description: product.description,
      price: product.price,
      category: product.category,
      shop_name: product.shop_name,
      shop_id: product.shop_id,
      distance: product.distance,
    }));

    res.json(results);

  } catch (error) {
    console.error("Search route error:", error);

    res.status(500).json({
      message: "Search failed",
    });
  }
});

module.exports = router;

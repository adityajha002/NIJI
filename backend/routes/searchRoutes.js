const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.json([]);
    }

    const params = new URLSearchParams({ q: query });

    if (req.query.lat) params.set("lat", req.query.lat);
    if (req.query.lng) params.set("lng", req.query.lng);
    if (req.query.radius) params.set("radius", req.query.radius);
    if (req.query.category) params.set("category", req.query.category);
    if (req.query.minPrice) params.set("minPrice", req.query.minPrice);
    if (req.query.maxPrice) params.set("maxPrice", req.query.maxPrice);
    if (req.query.sortBy) params.set("sortBy", req.query.sortBy);

    const searchUrl = process.env.MEILISEARCH_URL || "http://localhost:3001";
    const response = await fetch(`${searchUrl}/search?${params.toString()}`);

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
      distance:
        product._geoDistance != null
          ? Number((product._geoDistance / 1000).toFixed(1))
          : undefined,
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

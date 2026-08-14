// src/config/initIndex.js
import { meiliClient } from "./meiliClient.js";

export async function initMeilisearch() {
      try {
            const health = await meiliClient.health();
            console.log("Meilisearch connected:", health.status);

            await meiliClient.createIndex("products", { primaryKey: "product_id" });

            const productsIndex = meiliClient.index("products");
            await productsIndex.updateSettings({
                  searchableAttributes: ["keys"],
                  filterableAttributes: ["category", "price", "_geo"],
                  sortableAttributes: ["created_at", "price", "_geo"],
                  displayedAttributes: ["product_id", "name", "description", "image_url", "keys", "category", "price", "created_at", "_geo"],
            });

            console.log('Meilisearch "products" index ready');
      } catch (err) {
            console.error("Meilisearch init failed:", err.message);
      }
}
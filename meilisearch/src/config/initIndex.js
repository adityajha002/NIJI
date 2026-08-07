// src/config/initIndex.js
import { meiliClient } from "./meiliClient.js";

export async function initMeilisearch() {
      try {
            const health = await meiliClient.health();
            console.log("Meilisearch connected:", health.status);

            await meiliClient.createIndex("products", { primaryKey: "id" });

            const productsIndex = meiliClient.index("products");
            await productsIndex.updateSettings({
                  searchableAttributes: ["keywords"],
                  filterableAttributes: ["category", "price", "_geo"],
                  sortableAttributes: ["created_at", "price", "_geo"],
                  displayedAttributes: ["id", "name", "image_url"],
            });

            console.log('Meilisearch "products" index ready');
      } catch (err) {
            console.error("Meilisearch init failed:", err.message);
      }
}
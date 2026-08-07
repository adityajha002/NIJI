import { meiliClient } from "../config/meiliClient.js";

export function indexProduct(product) {
      const productsIndex = meiliClient.index("products");

      const doc = {
            id: product.id,
            name: product.name,
            image_url: product.image_url,
            keywords: product.keywords,
            category: product.category,
            price: product.price,
            created_at: product.created_at,
            _geo: {
                  lat: product.shop_lat,
                  lng: product.shop_lng,
            },
      };
      // fire-and-forget: don't block the caller on Meilisearch's response
      productsIndex.addDocuments([doc]).catch((err) => {
            console.error(`Failed to index product ${product.id}:`, err.message);
            // TODO: product_queue retry hook goes here
      });
}
import { meiliClient } from "../config/meiliClient.js";

export function indexProduct(product) {
  const productsIndex = meiliClient.index("products");

  const doc = {
    product_id: product.product_id,
    name: product.name,
    image_url: product.image_url,
    keywords: product.keywords ?? [],
    category: product.category,
    price: product.price,
    created_at: product.created_at,
    _geo: {
      lat: product.shop_lat,
      lng: product.shop_lng,
    },
  };

  return productsIndex.addDocuments([doc]).catch((err) => {
    console.error(`Failed to index product ${product.product_id}:`, err.message);
    throw err;
  });
}
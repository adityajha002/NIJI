import { meiliClient } from "../config/meiliClient.js";

export function indexProduct(product) {
  const productsIndex = meiliClient.index("products");

  const doc = {
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    image_url: product.image_url,
    keys: product.keys ?? [],
    category: product.category,
    price: product.price,
    created_at: product.created_at,
    ...(product.shop_lat != null && product.shop_lng != null
      ? { _geo: { lat: product.shop_lat, lng: product.shop_lng } }
      : {}),
  };

  return productsIndex.addDocuments([doc]).catch((err) => {
    console.error(`Failed to index product ${product.product_id}:`, err.message);
    throw err;
  });
}
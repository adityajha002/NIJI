import { meiliClient } from "../config/meiliClient.js";
import { supabase } from "../config/supabase.js";

export async function indexAll() {
  const { data: products, error } = await supabase
    .from("products")
    .select("product_id, name, description, imageurl, keys, price, created_at, shop_id, shops(category, latitude, longitude)")
    .not("keys", "is", null);

  if (error) {
    console.error("Supabase query failed:", error);
    throw error;
  }

  const docs = products.map((p) => ({
    product_id: p.product_id,
    name: p.name,
    description: p.description,
    image_url: p.imageurl,
    keys: p.keys,
    category: p.shops.category,
    price: p.price,
    created_at: p.created_at,
    ...(p.shops.latitude != null && p.shops.longitude != null
      ? { _geo: { lat: p.shops.latitude, lng: p.shops.longitude } }
      : {}),
  }));

  const productsIndex = meiliClient.index("products");
  const failedIds = [];


  const chunkSize = 500;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    try {
      await productsIndex.addDocuments(chunk);
    } catch (err) {
      console.error(`Reindex batch ${i}-${i + chunkSize} failed:`, err.message);
      failedIds.push(...chunk.map((d) => d.product_id));
    }
  }

  console.log(`Reindex complete: ${docs.length - failedIds.length}/${docs.length} succeeded`);
  return failedIds;
}
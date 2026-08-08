import { meiliClient } from "../config/meiliClient.js";
import { supabase } from "../config/supabase.js";

export async function reQueue() {
  const { data: queueRows, error } = await supabase
    .from("product_queue")
    .select("product_id, products(product_id, name, image_url, keywords, category, price, created_at, shops(latitude, longitude))")
    .eq("gemini_status", "done")
    .eq("meilisearch_status", "failed");

  if (error) throw error;
  if (!queueRows.length) return;

  const productsIndex = meiliClient.index("products");

  for (const row of queueRows) {
    const p = row.products;
    const doc = {
      product_id: p.product_id,
      name: p.name,
      image_url: p.image_url,
      keywords: p.keywords,
      category: p.category,
      price: p.price,
      created_at: p.created_at,
      _geo: { lat: p.shops.latitude, lng: p.shops.longitude },
    };

    try {
      await productsIndex.addDocuments([doc]);
      await supabase.from("product_queue").delete().eq("product_id", p.product_id);
    } catch (err) {
      console.error(`Retry failed for product ${p.product_id}:`, err.message);
    }
  }
}
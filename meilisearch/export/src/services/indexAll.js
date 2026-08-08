import { meiliClient } from "../config/meiliClient.js";
import { supabase } from "../config/supabase.js"; 

export async function indexAll() {
  const { data: products, error } = await supabase
    .from("products")
    .select("product_id, name, image_url, keywords, category, price, created_at, shop_id, shops(latitude, longitude)")
    .not("keywords", "is", null); 

  if (error) throw error;

  const docs = products.map((p) => ({
    product_id: p.product_id,
    name: p.name,
    image_url: p.image_url,
    keywords: p.keywords,
    category: p.category,
    price: p.price,
    created_at: p.created_at,
    _geo: { lat: p.shops.latitude, lng: p.shops.longitude },
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
      failedIds.push(...chunk.map((d) => d.id));
    }
  }

  console.log(`Reindex complete: ${docs.length - failedIds.length}/${docs.length} succeeded`);
  return failedIds; 
}
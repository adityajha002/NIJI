import { meiliClient } from "../config/meiliClient.js";

export async function searchProducts({
  query,
  userLat,
  userLng,
  radiusMeters,
  category,
  minPrice,
  maxPrice,
  sortBy, 
}) {
  const productsIndex = meiliClient.index("products");

  const filters = [];
  if (userLat != null && userLng != null) {
    filters.push(`_geoRadius(${userLat}, ${userLng}, ${radiusMeters})`);
  }
  if (category) filters.push(`category = "${category}"`);
  if (minPrice != null) filters.push(`price >= ${minPrice}`);
  if (maxPrice != null) filters.push(`price <= ${maxPrice}`);

  const sortMap = {
    distance: [`_geoPoint(${userLat}, ${userLng}):asc`],
    price_asc: ["price:asc"],
    price_desc: ["price:desc"],
    newest: ["created_at:desc"],
  };

  const results = await productsIndex.search(query, {
    filter: filters.length ? filters.join(" AND ") : undefined,
    sort: sortBy && sortMap[sortBy] ? sortMap[sortBy] : undefined,
  });

  return results.hits;
}
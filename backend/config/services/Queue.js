const db = require('../db');
const { generateKeywords } = require('./geminiKeywords');

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'http://localhost:3001';

async function pushToMeilisearch(product, shop) {
  const response = await fetch(`${MEILISEARCH_URL}/index-product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      image_url: product.imageurl,
      keys: product.keys,
      category: shop.category,
      price: product.price,
      created_at: product.created_at,
      shop_lat: shop.latitude,
      shop_lng: shop.longitude,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Meilisearch push failed (${response.status}): ${errText}`);
  }
}

async function processProduct(product, shop) {
  // Create the queue row (defaults: gemini_status=pending, meilisearch_status=pending)
  await db.query(
    'INSERT INTO product_queue (product_id) VALUES ($1) ON CONFLICT (product_id) DO NOTHING',
    [product.product_id]
  );

  let keywords;
  try {
    keywords = await generateKeywords(product.name, product.description);
  } catch (err) {
    console.error(`Gemini failed for product ${product.product_id}:`, err.message);
    await db.query(
      "UPDATE product_queue SET gemini_status = 'failed', updated_at = now() WHERE product_id = $1",
      [product.product_id]
    );
    return; // stop here — no keywords, nothing to push to Meilisearch yet
  }

  // Gemini succeeded — save keywords, mark done
  await db.query('UPDATE products SET keys = $1 WHERE product_id = $2', [keywords, product.product_id]);
  await db.query(
    "UPDATE product_queue SET gemini_status = 'done', updated_at = now() WHERE product_id = $1",
    [product.product_id]
  );

  // Now try pushing to Meilisearch
  try {
    await pushToMeilisearch({ ...product, keys: keywords }, shop);
    await db.query('DELETE FROM product_queue WHERE product_id = $1', [product.product_id]); // done+done, nothing left to track
  } catch (err) {
    console.error(`Meilisearch push failed for product ${product.product_id}:`, err.message);
    await db.query(
      "UPDATE product_queue SET meilisearch_status = 'failed', updated_at = now() WHERE product_id = $1",
      [product.product_id]
    );
    // no throw — reQueue() on the search service picks this up within 5 min
  }
}

async function retryQueue() {
  // Retry Gemini failures
  const geminiFailed = await db.query(
    `SELECT p.*, s.category, s.latitude, s.longitude
     FROM product_queue q
     JOIN products p ON p.product_id = q.product_id
     JOIN shops s ON s.shopid = p.shop_id
     WHERE q.gemini_status = 'failed'`
  );

  for (const row of geminiFailed.rows) {
    const shop = { category: row.category, latitude: row.latitude, longitude: row.longitude };
    await processProduct(row, shop); // re-runs the whole flow from scratch
  }

  // Retry Meilisearch failures (backup to the search service's own 5-min retry)
  const meiliFailed = await db.query(
    `SELECT p.*, s.category, s.latitude, s.longitude
     FROM product_queue q
     JOIN products p ON p.product_id = q.product_id
     JOIN shops s ON s.shopid = p.shop_id
     WHERE q.gemini_status = 'done' AND q.meilisearch_status = 'failed'`
  );

  for (const row of meiliFailed.rows) {
    const shop = { category: row.category, latitude: row.latitude, longitude: row.longitude };
    try {
      await pushToMeilisearch({ ...row, keys: row.keys }, shop);
      await db.query('DELETE FROM product_queue WHERE product_id = $1', [row.product_id]);
    } catch (err) {
      console.error(`Retry: Meilisearch push failed again for ${row.product_id}:`, err.message);
      // leave as-is, next sweep or the search service's own retry tries again
    }
  }
}

module.exports = { processProduct, retryQueue };


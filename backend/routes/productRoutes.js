const express = require('express');
const db = require('../config/db');
const upload = require('../middleware/upload');
const { uploadImageBuffer } = require('../config/cloudinary');
const verifyToken = require('../middleware/verifyToken');
const { processProduct } = require('../config/services/Queue');
const router = express.Router();

const uploadProductImage = (req, res, next) => {
      upload.single('image')(req, res, (error) => {
            if (error) {
                  return res.status(400).json({ error: error.message });
            }
            next();
      });
}

const createProduct = async (req, res) => {
      const { name, price, description } = req.body;

      try {
            if (!name || !price) {
                  return res.status(400).json({ error: 'name and price are required' });
            }

            if (!req.file) {
                  return res.status(400).json({ error: 'Image file is required' });
            }

            const shopResult = await db.query(
                  'SELECT * FROM shops WHERE userid = $1 LIMIT 1',
                  [req.user.id]
            );

            if (shopResult.rows.length === 0) {
                  return res.status(404).json({ error: 'No shop found for this user' });
            }

            let imageUrl;

            try {
                  const uploadResult = await uploadImageBuffer(req.file.buffer, 'niji/products');
                  imageUrl = uploadResult.secure_url;
            } catch (error) {
                  console.error('Error uploading product image:', error);
                  return res.status(502).json({ error: 'Image upload failed. Check Cloudinary credentials.' });
            }

            const shop = shopResult.rows[0];
            const result = await db.query(
                  'INSERT INTO products (shop_id, name, description, price, imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                  [shop.shopid, name, description || null, price, imageUrl]
            );

            const product = result.rows[0];
            res.status(201).json(product);
            processProduct(product, shop).catch((err) => {
                  console.error(`Queue processing failed for product ${product.product_id}:`, err.message);
            });
      } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Internal server error' });
      }
};

const getProductsForCurrentShop = async (req, res) => {
      try {
            const shopResult = await db.query(
                  'SELECT shopid FROM shops WHERE userid = $1 LIMIT 1',
                  [req.user.id]
            );

            if (shopResult.rows.length === 0) {
                  return res.status(404).json({ error: 'No shop found for this user' });
            }

            const result = await db.query(
                  'SELECT * FROM products WHERE shop_id = $1 ORDER BY created_at DESC',
                  [shopResult.rows[0].shopid]
            );

            res.json(result.rows);
      } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal server error' });
      }
};

const getProductById = async (req, res) => {
      const { productId } = req.params;

      try {
            const result = await db.query(
                  `SELECT
                        p.product_id,
                        p.name,
                        p.description,
                        p.price,
                        p.imageurl AS image_url,
                        s.shopid AS shop_id,
                        s.shopname AS shop_name,
                        s.category AS shop_category,
                        s.description AS shop_description,
                        s.imageurl AS shop_image_url
                  FROM products p
                  LEFT JOIN shops s ON s.shopid = p.shop_id
                  WHERE p.product_id = $1
                  LIMIT 1`,
                  [productId]
            );

            if (result.rows.length === 0) {
                  return res.status(404).json({ error: 'Product not found' });
            }

            res.json(result.rows[0]);
      } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Internal server error' });
      }
};

router.get("/shop/:shopId", async (req, res) => {
      try {
            const { shopId } = req.params;
            if (!shopId) {
                  return res.status(400).json({ error: 'No Shop ID provided' });
            }
            const result = await db.query('SELECT * FROM products WHERE shop_id = $1', [shopId]);
            res.json(result.rows);
      } catch (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ error: 'Server error' });
      }
});

router.get('/', verifyToken, getProductsForCurrentShop);
router.get('/:productId', getProductById);
router.post('/', verifyToken, uploadProductImage, createProduct);

module.exports = router;

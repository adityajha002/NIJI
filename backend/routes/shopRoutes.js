const express = require('express');
const db = require('../config/db');
const upload = require('../middleware/upload');
const { uploadImageBuffer } = require('../config/cloudinary');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

const uploadShopImage = (req, res, next) => {
      upload.single('image')(req, res, (error) => {
        if (error) {
          return res.status(400).json({ error: error.message });
        }
        next();
      });
};

const createShop = async (req, res) => {
      const { name, category, pincode, description, latitude, longitude, tags } = req.body;
      let client;

      try {
            if (!name || !category || !pincode || !description) {
                  return res.status(400).json({ error: 'name, category, pincode and description are required' });
            }

            if (!req.file) {
                  return res.status(400).json({ error: 'Image file is required' });
            }

            let imageUrl;

            try {
                  const uploadResult = await uploadImageBuffer(req.file.buffer);
                  imageUrl = uploadResult.secure_url;
            } catch (error) {
                  console.error('Error uploading shop image:', error);
                  return res.status(502).json({ error: 'Image upload failed. Check Cloudinary credentials.' });
            }

            client = await db.connect();
            await client.query('BEGIN');

            const result = await client.query(
            'INSERT INTO shops (shopname, category, pincode, description, imageurl, latitude, longitude, userid, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [name, category, pincode, description, imageUrl, latitude, longitude, req.user.id, tags || null]
            );

            await client.query('UPDATE users SET role = $1 WHERE id = $2', ['shop', req.user.id]);
            await client.query('COMMIT');

      res.json(result.rows[0]);
      } catch (error) {
            if (client) {
                  await client.query('ROLLBACK');
            }
            console.error('Error creating shop:', error);
            res.status(500).json({ error: 'Internal server error' });
      } finally {
            if (client) {
                  client.release();
            }
      }
}

const updateShop = async (req, res) => {
  const { name, category, pincode, description, latitude, longitude, tags } = req.body;

  try {
    if (!name || !category || !pincode || !description) {
      return res.status(400).json({ error: 'name, category, pincode and description are required' });
    }

    const result = await db.query(
      `UPDATE shops
       SET shopname = $1,
           category = $2,
           pincode = $3,
           description = $4,
           latitude = $5,
           longitude = $6,
           tags = $7
       WHERE userid = $8
       RETURNING *`,
      [
        name,
        category,
        pincode,
        description,
        latitude || null,
        longitude || null,
        tags || null,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No shop found for this user' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getShopById = async (req, res) => {
  const { shopId } = req.params;

  try {
    const result = await db.query('SELECT * FROM shops WHERE shopid = $1', [shopId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getShopsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const result = category === 'All'
      ? await db.query('SELECT * FROM shops ORDER BY created_at DESC LIMIT 9')
      : await db.query('SELECT * FROM shops WHERE category = $1 ORDER BY created_at DESC LIMIT 9', [category]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching shops by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM shops WHERE userid = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No shop found for this user' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching shop:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/loadCategory/:category', getShopsByCategory);
router.put('/dashboard', verifyToken, updateShop);
router.post('/addShop', verifyToken, uploadShopImage, createShop);
router.get('/:shopId', getShopById);

module.exports = router;

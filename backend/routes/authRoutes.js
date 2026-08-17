const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const {loginLimiter} = require('../middleware/rateLimiter')

router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: 'name, username and password are required' });
  }
      try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await db.query(
                  'INSERT INTO users (name, username, password,role,lat,long) VALUES ($1, $2, $3, $4, $5, $6)',
                  [name, username, hashedPassword, 'user', null, null]
            );
            res.status(201).json({message: 'new user created succesfully'});
      } catch (err) {
            if (err.code === '23505') {
                  return res.status(409).json({ error: 'Username already exists' });
            }
            console.error(err);
            res.status(500).json({ error: 'Server error' });
      }
});

router.post('/login', loginLimiter, async (req,res) => {
      const {username,password,lat,long} = req.body;

      if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required' });
      }

      try{
            const result = await db.query('SELECT * FROM USERS WHERE USERNAME = $1',[username]);
            const user = result.rows[0];

            if(!user) {
                  return res.status(400).json({ error : 'Invalid Credentials' });
            }

            const Match = await bcrypt.compare(password,user.password);
            if(!Match) {
                  return res.status(400).json({ error : 'Invalid Credentials' });
            }

            if (lat!=null && long !=null){
                  await db.query('UPDATE users SET lat=$1, long=$2 WHERE id=$3',[lat,long,user.id]);
            }

            const token = jwt.sign(
                  { id: user.id, name: user.name, username: user.username, role: user.role },
                  process.env.JWT_SECRET,
                  { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.json({
                  token,
                  user: {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        role: user.role,
                  }    
            })
      }catch(err){
            console.log(err);
            res.status(500).json({ error: 'Server error' });
      }
});

module.exports = router;

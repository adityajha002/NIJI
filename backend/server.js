const express = require('express');
const cors = require('cors');
const shopRoutes = require('./routes/shopRoutes');
const authRoutes = require('./routes/authRoutes');
const prodRoutes = require('./routes/productRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", prodRoutes);

app.use("/api/shops", shopRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

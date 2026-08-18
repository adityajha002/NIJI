const express = require('express');
const cors = require('cors');
const shopRoutes = require('./routes/shopRoutes');
const authRoutes = require('./routes/authRoutes');
const prodRoutes = require('./routes/productRoutes');
const { retryQueue } = require('./config/services/Queue');
const searchRoutes = require('./routes/searchRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", prodRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/shops", shopRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
retryQueue().catch((err) => console.error('retryQueue failed:', err.message));
setInterval(() => {
  retryQueue().catch((err) => console.error('retryQueue failed:', err.message));
}, 3 * 60 * 1000);

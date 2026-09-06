const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route to confirm the server + DB connection works
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const { authenticateToken, requireRole } = require('./middleware/auth');

app.get('/api/protected-test', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, your role is ${req.user.role}` });
});

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const shipmentRoutes = require('./routes/shipments');
app.use('/api/shipments', shipmentRoutes);

const pool = require('./db');
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', dbTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
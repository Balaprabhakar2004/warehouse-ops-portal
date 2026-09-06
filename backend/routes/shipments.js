const express = require('express');
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET all shipments — any logged-in user can view
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.quantity, s.status, s.created_at, s.updated_at,
              p.name AS product_name, p.sku
       FROM shipments s
       JOIN products p ON s.product_id = p.id
       ORDER BY s.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// GET single shipment
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shipments WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// CREATE shipment — admin/manager only
router.post('/', authenticateToken, requireRole('admin', 'manager'), async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'product_id and quantity are required' });
  }

  try {
    // Confirm the product exists and has enough stock
    const productRes = await pool.query('SELECT quantity FROM products WHERE id = $1', [product_id]);
    if (productRes.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (productRes.rows[0].quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock for this shipment' });
    }

    const result = await pool.query(
      `INSERT INTO shipments (product_id, quantity, status) VALUES ($1, $2, 'pending') RETURNING *`,
      [product_id, quantity]
    );

    // Deduct shipped quantity from product stock
    await pool.query('UPDATE products SET quantity = quantity - $1 WHERE id = $2', [quantity, product_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// UPDATE shipment status — admin/manager/staff can update status (e.g. staff marks "delivered")
const VALID_STATUSES = ['pending', 'in_transit', 'delivered'];

router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `UPDATE shipments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update shipment status' });
  }
});

// DELETE shipment — admin only
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM shipments WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json({ message: 'Shipment deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

module.exports = router;
const express = require('express');
const pool = require('../db');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET all products — any logged-in user can view
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.sku, p.name, p.quantity, p.warehouse_id, w.name AS warehouse_name
       FROM products p
       LEFT JOIN warehouses w ON p.warehouse_id = w.id
       ORDER BY p.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// CREATE product — admin/manager only
router.post('/', authenticateToken, requireRole('admin', 'manager'), async (req, res) => {
  const { sku, name, quantity, warehouse_id } = req.body;

  if (!sku || !name) {
    return res.status(400).json({ error: 'SKU and name are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (sku, name, quantity, warehouse_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [sku, name, quantity || 0, warehouse_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// UPDATE product — admin/manager only
router.put('/:id', authenticateToken, requireRole('admin', 'manager'), async (req, res) => {
  const { name, quantity, warehouse_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products SET name = COALESCE($1, name), quantity = COALESCE($2, quantity),
       warehouse_id = COALESCE($3, warehouse_id) WHERE id = $4 RETURNING *`,
      [name, quantity, warehouse_id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product — admin only
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
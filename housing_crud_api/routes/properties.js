const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * POST /properties
 * Create property (requires landlord_id)
 */
router.post('/', async (req, res) => {
  const { landlord_id, title, address, city, description } = req.body;
  if (!landlord_id || !title || !address || !city) {
    return res.status(400).json({ error: 'landlord_id, title, address and city are required' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO properties (landlord_id, title, address, city, description)
       VALUES (?, ?, ?, ?, ?)`,
      [landlord_id, title, address, city, description || null]
    );
    const [rows] = await pool.execute('SELECT * FROM properties WHERE property_id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'landlord_id does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /properties
 * List properties (optionally filter by city)
 */
router.get('/', async (req, res) => {
  try {
    const city = req.query.city;
    let sql = 'SELECT p.*, l.name AS landlord_name FROM properties p LEFT JOIN landlords l ON p.landlord_id = l.landlord_id';
    let params = [];
    if (city) {
      sql += ' WHERE p.city = ?';
      params.push(city);
    }
    sql += ' ORDER BY p.created_at DESC';
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /properties/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.*, l.name AS landlord_name
       FROM properties p
       LEFT JOIN landlords l ON p.landlord_id = l.landlord_id
       WHERE p.property_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /properties/:id
 */
router.put('/:id', async (req, res) => {
  const { title, address, city, description } = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE properties SET title = COALESCE(?, title),
                             address = COALESCE(?, address),
                             city = COALESCE(?, city),
                             description = COALESCE(?, description)
       WHERE property_id = ?`,
      [title, address, city, description, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Property not found' });
    const [rows] = await pool.execute('SELECT * FROM properties WHERE property_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /properties/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM properties WHERE property_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

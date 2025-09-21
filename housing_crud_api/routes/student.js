const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * POST /students
 * Create a new student
 */
router.post('/', async (req, res) => {
  const { student_number, first_name, last_name, email, phone, dob } = req.body;
  if (!student_number || !first_name || !last_name || !email) {
    return res.status(400).json({ error: 'student_number, first_name, last_name and email are required' });
  }
  try {
    const [result] = await pool.execute(
      `INSERT INTO students (student_number, first_name, last_name, email, phone, dob)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student_number, first_name, last_name, email, phone || null, dob || null]
    );
    const [rows] = await pool.execute('SELECT * FROM students WHERE student_id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'student_number or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /students
 * List all students
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM students ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /students/:id
 * Get student by id
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /students/:id
 * Update student
 */
router.put('/:id', async (req, res) => {
  const { first_name, last_name, email, phone, dob } = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE students SET first_name = COALESCE(?, first_name),
                           last_name  = COALESCE(?, last_name),
                           email      = COALESCE(?, email),
                           phone      = COALESCE(?, phone),
                           dob        = COALESCE(?, dob)
       WHERE student_id = ?`,
      [first_name, last_name, email, phone, dob, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    const [rows] = await pool.execute('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already in use' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /students/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM students WHERE student_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

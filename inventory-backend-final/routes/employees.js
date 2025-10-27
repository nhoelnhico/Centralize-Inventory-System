const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  try {
    const { employee_id, name, email, department, position } = req.body;
    await pool.query(
      'INSERT INTO employees (employee_id, name, email, department, position) VALUES (?, ?, ?, ?, ?)',
      [employee_id, name, email, department, position]
    );
    res.json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id, name, email, department, position } = req.body;
    await pool.query(
      'UPDATE employees SET employee_id=?, name=?, email=?, department=?, position=? WHERE id=?',
      [employee_id, name, email, department, position, id]
    );
    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

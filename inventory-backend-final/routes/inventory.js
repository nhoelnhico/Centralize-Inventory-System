const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new inventory record
router.post('/', async (req, res) => {
  try {
    const { item_name, quantity, category, status } = req.body;

    await pool.query(
      'INSERT INTO inventory (item_name, quantity, category, status) VALUES (?, ?, ?, ?)',
      [item_name, quantity, category, status]
    );

    res.json({ message: 'Inventory item added successfully' });
  } catch (err) {
    console.error('Error adding inventory item:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update inventory
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, quantity, category, status } = req.body;

    await pool.query(
      'UPDATE inventory SET item_name=?, quantity=?, category=?, status=? WHERE id=?',
      [item_name, quantity, category, status, id]
    );

    res.json({ message: 'Inventory updated successfully' });
  } catch (err) {
    console.error('Error updating inventory:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM inventory WHERE id=?', [id]);
    res.json({ message: 'Inventory deleted successfully' });
  } catch (err) {
    console.error('Error deleting inventory item:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

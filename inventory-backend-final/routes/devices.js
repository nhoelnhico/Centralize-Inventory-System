const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all devices
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM devices');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add new device
router.post('/', async (req, res) => {
  try {
    const { device_name, serial_number, category, status } = req.body;

    if (!device_name || !serial_number) {
      return res.status(400).json({ error: 'Device name and serial number required.' });
    }

    await pool.query(
      'INSERT INTO devices (device_name, serial_number, category, status) VALUES (?, ?, ?, ?)',
      [device_name, serial_number, category, status]
    );

    res.json({ message: 'Device added successfully' });
  } catch (err) {
    console.error('Error adding device:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update device
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { device_name, serial_number, category, status } = req.body;

    await pool.query(
      'UPDATE devices SET device_name=?, serial_number=?, category=?, status=? WHERE id=?',
      [device_name, serial_number, category, status, id]
    );

    res.json({ message: 'Device updated successfully' });
  } catch (err) {
    console.error('Error updating device:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete device
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM devices WHERE id=?', [id]);
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error('Error deleting device:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

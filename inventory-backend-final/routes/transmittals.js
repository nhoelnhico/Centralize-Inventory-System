// routes/transmittals.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all transmittals
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM transmittals ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching transmittals:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST new transmittal
router.post("/", async (req, res) => {
  try {
    const { employee_name, device_list, transaction_type, date_issued, status, signature } = req.body;
    await pool.query(
      `INSERT INTO transmittals 
        (employee_name, device_list, transaction_type, date_issued, status, signature)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_name, device_list, transaction_type, date_issued, status, signature]
    );
    res.json({ message: "Transmittal added successfully" });
  } catch (err) {
    console.error("Error adding transmittal:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ PUT (Update) transmittal
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_name, device_list, transaction_type, date_issued, status, signature } = req.body;
    await pool.query(
      `UPDATE transmittals 
       SET employee_name=?, device_list=?, transaction_type=?, date_issued=?, status=?, signature=? 
       WHERE id=?`,
      [employee_name, device_list, transaction_type, date_issued, status, signature, id]
    );
    res.json({ message: "Transmittal updated successfully" });
  } catch (err) {
    console.error("Error updating transmittal:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE transmittal
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM transmittals WHERE id=?", [id]);
    res.json({ message: "Transmittal deleted successfully" });
  } catch (err) {
    console.error("Error deleting transmittal:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

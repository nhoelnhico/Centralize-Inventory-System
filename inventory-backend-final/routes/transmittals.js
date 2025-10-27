// routes/transmittals.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Generate Transmittal Number
function genNo() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `T-${y}${m}${day}-${rand}`;
}

// GET all transmittals
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, e.name AS employee_name 
      FROM transmittals t 
      LEFT JOIN employees e ON e.id = t.employee_id 
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching transmittals:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ADD new transmittal
router.post("/", async (req, res) => {
  const { employee_id, trans_type, date_trans, remarks, signature, devices } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const trans_no = genNo();

    // Insert transmittal
    const [insertResult] = await conn.query(
      `INSERT INTO transmittals (transmittal_no, employee_id, trans_type, date_trans, remarks, signature) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [trans_no, employee_id, trans_type, date_trans || new Date(), remarks, signature]
    );

    const transId = insertResult.insertId;

    // Normalize devices (array of IDs or objects)
    const deviceList = Array.isArray(devices)
      ? devices.map((d) => (typeof d === "object" ? d.device_id : d))
      : [];

    for (const deviceId of deviceList) {
      await conn.query(
        `INSERT INTO transmittal_items (transmittal_id, device_id, status) VALUES (?, ?, ?)`,
        [transId, deviceId, trans_type === "OUT" ? "issued" : "returned"]
      );

      if (trans_type === "OUT") {
        await conn.query("UPDATE devices SET status='in_use' WHERE id=?", [deviceId]);
        await conn.query(
          "INSERT INTO employee_assets (employee_id, device_id, assigned_date) VALUES (?, ?, CURDATE())",
          [employee_id, deviceId]
        );
      } else {
        await conn.query("UPDATE devices SET status='available' WHERE id=?", [deviceId]);
        await conn.query("DELETE FROM employee_assets WHERE device_id=?", [deviceId]);
      }
    }

    await conn.commit();
    res.json({ message: "Transmittal added successfully", trans_no });
  } catch (err) {
    await conn.rollback();
    console.error("Error adding transmittal:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// UPDATE transmittal
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { employee_id, trans_type, date_trans, remarks, signature, devices } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE transmittals 
       SET employee_id=?, trans_type=?, date_trans=?, remarks=?, signature=? 
       WHERE id=?`,
      [employee_id, trans_type, date_trans, remarks, signature, id]
    );

    await conn.query("DELETE FROM transmittal_items WHERE transmittal_id=?", [id]);

    const deviceList = Array.isArray(devices)
      ? devices.map((d) => (typeof d === "object" ? d.device_id : d))
      : [];

    for (const deviceId of deviceList) {
      await conn.query(
        `INSERT INTO transmittal_items (transmittal_id, device_id, status) VALUES (?, ?, ?)`,
        [id, deviceId, trans_type === "OUT" ? "issued" : "returned"]
      );

      if (trans_type === "OUT") {
        await conn.query("UPDATE devices SET status='in_use' WHERE id=?", [deviceId]);
        await conn.query(
          "INSERT INTO employee_assets (employee_id, device_id, assigned_date) VALUES (?, ?, CURDATE())",
          [employee_id, deviceId]
        );
      } else {
        await conn.query("UPDATE devices SET status='available' WHERE id=?", [deviceId]);
        await conn.query("DELETE FROM employee_assets WHERE device_id=?", [deviceId]);
      }
    }

    await conn.commit();
    res.json({ message: "Transmittal updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Error updating transmittal:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// DELETE transmittal
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM transmittals WHERE id=?", [id]);
    await pool.query("DELETE FROM transmittal_items WHERE transmittal_id=?", [id]);
    res.json({ message: "Transmittal deleted successfully" });
  } catch (err) {
    console.error("Error deleting transmittal:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

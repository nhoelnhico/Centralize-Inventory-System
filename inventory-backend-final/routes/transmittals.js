// routes/transmittals.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ Generate Transmittal Number
function genNo() {
  const d = new Date();
  const y = d.getFullYear().toString();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `T-${y}${m}${day}-${rand}`;
}

// ✅ GET all transmittals
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, e.name AS employee_name 
       FROM transmittals t 
       LEFT JOIN employees e ON e.id = t.employee_id 
       ORDER BY t.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching transmittals:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ POST - Add new transmittal
router.post("/", async (req, res) => {
  const { employee_id, trans_type, date_trans, remarks, signature, devices } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const trans_no = genNo();

    // Insert transmittal
    const [insertResult] = await conn.query(
      `INSERT INTO transmittals 
       (transmittal_no, employee_id, trans_type, date_trans, remarks, signature) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [trans_no, employee_id, trans_type, date_trans || new Date(), remarks, signature]
    );

    const transId = insertResult.insertId;

    // Link devices
    if (Array.isArray(devices)) {
      for (const d of devices) {
        await conn.query(
          `INSERT INTO transmittal_items (transmittal_id, device_id, status) VALUES (?, ?, ?)`,
          [transId, d.device_id, trans_type === "OUT" ? "issued" : "returned"]
        );

        // Update device status
        if (trans_type === "OUT") {
          await conn.query("UPDATE devices SET status = ? WHERE id = ?", ["in_use", d.device_id]);
          await conn.query(
            "INSERT INTO employee_assets (employee_id, device_id, assigned_date) VALUES (?, ?, CURDATE())",
            [employee_id, d.device_id]
          );
        } else {
          await conn.query("UPDATE devices SET status = ? WHERE id = ?", ["available", d.device_id]);
          await conn.query("DELETE FROM employee_assets WHERE device_id = ?", [d.device_id]);
        }
      }
    }

    await conn.commit();
    res.json({ message: "✅ Transmittal added successfully", trans_no });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error adding transmittal:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ✅ PUT - Update transmittal
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { employee_id, trans_type, date_trans, remarks, signature, devices } = req.body;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Update transmittal main record
    await conn.query(
      `UPDATE transmittals 
       SET employee_id=?, trans_type=?, date_trans=?, remarks=?, signature=? 
       WHERE id=?`,
      [employee_id, trans_type, date_trans, remarks, signature, id]
    );

    // Remove old items then re-add
    await conn.query("DELETE FROM transmittal_items WHERE transmittal_id=?", [id]);

    if (Array.isArray(devices)) {
      for (const d of devices) {
        await conn.query(
          `INSERT INTO transmittal_items (transmittal_id, device_id, status) VALUES (?, ?, ?)`,
          [id, d.device_id, trans_type === "OUT" ? "issued" : "returned"]
        );

        if (trans_type === "OUT") {
          await conn.query("UPDATE devices SET status = ? WHERE id = ?", ["in_use", d.device_id]);
          await conn.query(
            "INSERT INTO employee_assets (employee_id, device_id, assigned_date) VALUES (?, ?, CURDATE())",
            [employee_id, d.device_id]
          );
        } else {
          await conn.query("UPDATE devices SET status = ? WHERE id = ?", ["available", d.device_id]);
          await conn.query("DELETE FROM employee_assets WHERE device_id = ?", [d.device_id]);
        }
      }
    }

    await conn.commit();
    res.json({ message: "✅ Transmittal updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error updating transmittal:", err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// ✅ DELETE transmittal
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM transmittals WHERE id=?", [id]);
    res.json({ message: "🗑️ Transmittal deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting transmittal:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

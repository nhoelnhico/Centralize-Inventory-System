const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all logs
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM activitylogs ORDER BY id DESC");
  res.json(rows);
});

// Add log
router.post("/", async (req, res) => {
  const { message, date } = req.body;
  await pool.query("INSERT INTO activitylogs (message, date) VALUES (?, ?)", [message, date]);
  res.json({ message: "Log added" });
});

module.exports = router;

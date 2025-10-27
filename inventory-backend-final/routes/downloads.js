const express = require('express');
const router = require('express').Router();
const pool = require('../db');
const { Parser } = require('json2csv');

router.get('/employees/csv', async (req,res)=>{
  try{
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY name');
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('employees_export.csv');
    res.send(csv);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.get('/inventory/csv', async (req,res)=>{
  try{
    const [rows] = await pool.query('SELECT d.*, e.name as assigned_to FROM devices d LEFT JOIN employee_assets ea ON ea.device_id = d.id LEFT JOIN employees e ON e.id = ea.employee_id ORDER BY d.created_at DESC');
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('inventory_export.csv');
    res.send(csv);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req,res)=>{
  const q = req.query.q || '';
  try{
    const [rows] = await pool.query(
      'SELECT * FROM devices WHERE device_name LIKE ? OR fam_tag LIKE ? OR serial_number LIKE ? ORDER BY created_at DESC',
      [`%${q}%`,`%${q}%`,`%${q}%`]
    );
    res.json(rows);
  }catch(err){ res.status(500).json({error: err.message});}
});

router.post('/', async (req,res)=>{
  const { device_type, device_name, serial_number, fam_tag, other_serial } = req.body;
  try{
    const [result] = await pool.query(
      'INSERT INTO devices (device_type,device_name,serial_number,fam_tag,other_serial) VALUES (?,?,?,?,?)',
      [device_type,device_name,serial_number,fam_tag,other_serial]
    );
    res.json({insertId: result.insertId});
  }catch(err){ res.status(500).json({error: err.message});}
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req,res)=>{
  const q = req.query.q || '';
  try{
    const [rows] = await pool.query(`
      SELECT t.*, e.name as employee_name, d.device_name
      FROM transmittals t
      LEFT JOIN employees e ON e.id = t.employee_id
      LEFT JOIN devices d ON d.id = t.device_id
      WHERE t.device_name LIKE ? OR t.fam_tag LIKE ? OR e.name LIKE ?
      ORDER BY t.trans_date DESC
    `, [`%${q}%`,`%${q}%`,`%${q}%`]);
    res.json(rows);
  }catch(err){ res.status(500).json({error: err.message});}
});

router.post('/', async (req,res)=>{
  const { trans_type, device_id, device_name, serial_number, fam_tag, qty=1, remarks, employee_id, signature } = req.body;
  const conn = await pool.getConnection();
  try{
    await conn.beginTransaction();
    const [ins] = await conn.query(
      'INSERT INTO transmittals (trans_type,device_id,device_name,serial_number,fam_tag,qty,remarks,employee_id,signature) VALUES (?,?,?,?,?,?,?,?,?)',
      [trans_type,device_id,device_name,serial_number,fam_tag,qty,remarks,employee_id,signature]
    );
    if(trans_type === 'OUT'){
      await conn.query('UPDATE devices SET status = ? WHERE id = ?', ['in_use', device_id]);
      if(employee_id){
        await conn.query('INSERT INTO employee_assets (employee_id, device_id, assigned_date) VALUES (?, ?, CURDATE())', [employee_id, device_id]);
      }
    } else {
      await conn.query('UPDATE devices SET status = ? WHERE id = ?', ['available', device_id]);
      await conn.query('DELETE FROM employee_assets WHERE device_id = ?', [device_id]);
    }
    await conn.commit();
    res.json({ insertId: ins.insertId });
  }catch(err){
    await conn.rollback();
    res.status(500).json({ error: err.message });
  }finally{
    conn.release();
  }
});

module.exports = router;

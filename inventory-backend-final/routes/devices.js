const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req,res)=>{
  const q = req.query.q || '';
  const type = req.query.type || '';
  try{
    let sql = 'SELECT d.*, e.employee_id as assigned_employee_id, e.name as assigned_employee_name FROM devices d LEFT JOIN employee_assets ea ON ea.device_id = d.id LEFT JOIN employees e ON e.id = ea.employee_id WHERE (d.device_name LIKE ? OR d.fam_tag LIKE ? OR d.serial_number LIKE ?)';
    const params = [`%${q}%`,`%${q}%`,`%${q}%`];
    if(type){ sql += ' AND d.device_type = ?'; params.push(type); }
    sql += ' ORDER BY d.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.post('/', async (req,res)=>{
  const { device_type, brand, model, device_name, serial_number, fam_tag, remarks, status } = req.body;
  try{
    const [result] = await pool.query('INSERT INTO devices (device_type,brand,model,device_name,serial_number,fam_tag,remarks,status) VALUES (?,?,?,?,?,?,?,?)',
      [device_type,brand,model,device_name,serial_number,fam_tag,remarks,status || 'available']);
    res.json({ insertId: result.insertId });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req,res)=>{
  const id = req.params.id;
  const { device_type, brand, model, device_name, serial_number, fam_tag, remarks, status } = req.body;
  try{
    await pool.query('UPDATE devices SET device_type=?,brand=?,model=?,device_name=?,serial_number=?,fam_tag=?,remarks=?,status=? WHERE id=?',
      [device_type,brand,model,device_name,serial_number,fam_tag,remarks,status,id]);
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    // prevent delete if device in use
    const [rows] = await pool.query('SELECT status FROM devices WHERE id = ?', [id]);
    if(rows[0] && rows[0].status === 'in_use') return res.status(400).json({ error: 'Cannot delete device that is in use' });
    await pool.query('DELETE FROM devices WHERE id = ?', [id]);
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

// export devices as CSV
router.get('/export/csv', async (req,res)=>{
  const { Parser } = require('json2csv');
  try{
    const [rows] = await pool.query('SELECT * FROM devices ORDER BY created_at DESC');
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('devices_export.csv');
    res.send(csv);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;

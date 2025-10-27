const express = require('express');
const router = express.Router();
const pool = require('../db');

// helper to generate transmittal no
function genNo(){
  const d = new Date();
  const y = d.getFullYear().toString();
  const m = (d.getMonth()+1).toString().padStart(2,'0');
  const day = d.getDate().toString().padStart(2,'0');
  const rand = Math.floor(Math.random()*900)+100;
  return `T-${y}${m}${day}-${rand}`;
}

router.post('/', async (req,res)=>{
  const { employee_id, trans_type, date_trans, remarks, signature, devices } = req.body;
  // devices = [{ device_id }, ...]
  const conn = await pool.getConnection();
  try{
    await conn.beginTransaction();
    const trans_no = genNo();
    const [ins] = await conn.query('INSERT INTO transmittals (transmittal_no,employee_id,trans_type,date_trans,remarks,signature) VALUES (?,?,?,?,?,?)',
      [trans_no, employee_id, trans_type, date_trans || new Date(), remarks, signature]);
    const transId = ins.insertId;
    for(const it of devices){
      await conn.query('INSERT INTO transmittal_items (transmittal_id, device_id, status) VALUES (?,?,?)', [transId, it.device_id, trans_type === 'OUT' ? 'issued' : 'returned']);
      // update device status and employee_assets
      if(trans_type === 'OUT'){
        await conn.query('UPDATE devices SET status = ? WHERE id = ?', ['in_use', it.device_id]);
        if(employee_id){
          await conn.query('INSERT INTO employee_assets (employee_id, device_id, assigned_date) VALUES (?, ?, CURDATE())', [employee_id, it.device_id]);
        }
      } else {
        await conn.query('UPDATE devices SET status = ? WHERE id = ?', ['available', it.device_id]);
        await conn.query('DELETE FROM employee_assets WHERE device_id = ?', [it.device_id]);
      }
    }
    await conn.commit();
    res.json({ insertId: transId, trans_no });
  }catch(err){
    await conn.rollback();
    res.status(500).json({ error: err.message });
  }finally{
    conn.release();
  }
});

router.get('/', async (req,res)=>{
  const q = req.query.q || '';
  try{
    const [rows] = await pool.query(`SELECT t.*, e.name as employee_name, (SELECT COUNT(*) FROM transmittal_items ti WHERE ti.transmittal_id = t.id) as device_count FROM transmittals t LEFT JOIN employees e ON e.id = t.employee_id WHERE t.transmittal_no LIKE ? OR e.name LIKE ? ORDER BY t.created_at DESC`, [`%${q}%`,`%${q}%`]);
    res.json(rows);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

// export transmittals CSV
router.get('/export/csv', async (req,res)=>{
  const { Parser } = require('json2csv');
  try{
    const [rows] = await pool.query('SELECT t.*, e.name as employee_name FROM transmittals t LEFT JOIN employees e ON e.id = t.employee_id ORDER BY t.created_at DESC');
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('transmittals_export.csv');
    res.send(csv);
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req,res)=>{
  const q = req.query.q || '';
  try{
    const [rows] = await pool.query('SELECT * FROM employees WHERE name LIKE ? OR employee_id LIKE ? OR department LIKE ? ORDER BY name', [`%${q}%`,`%${q}%`,`%${q}%`]);
    res.json(rows);
  }catch(err){ res.status(500).json({error: err.message}); }
});

router.post('/', async (req,res)=>{
  const { employee_id, name, position, department, date_hired, email } = req.body;
  try{
    const [result] = await pool.query('INSERT INTO employees (employee_id,name,position,department,date_hired,email) VALUES (?,?,?,?,?)',
      [employee_id,name,position,department,date_hired,email]);
    res.json({ insertId: result.insertId });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.put('/:id', async (req,res)=>{
  const id = req.params.id;
  const { employee_id, name, position, department, date_hired, email } = req.body;
  try{
    await pool.query('UPDATE employees SET employee_id=?,name=?,position=?,department=?,date_hired=?,email=? WHERE id=?',
      [employee_id,name,position,department,date_hired,email,id]);
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    const [empRows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    if(empRows.length === 0) return res.status(404).json({error:'Employee not found'});
    const emp = empRows[0];
    const [assets] = await pool.query('SELECT ea.id as assignment_id, d.* FROM employee_assets ea JOIN devices d ON d.id = ea.device_id WHERE ea.employee_id = ?', [id]);
    res.json({ employee: emp, assets });
  }catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;

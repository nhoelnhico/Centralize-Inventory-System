const express = require('express');
const router = express.Router();
const pool = require('../db');
const { Parser } = require('json2csv');

router.get('/employee/:id', async (req,res)=>{
  const id = req.params.id;
  try{
    const [empRows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    if(empRows.length === 0) return res.status(404).send('Employee not found');
    const emp = empRows[0];
    const [assets] = await pool.query(`
      SELECT d.device_type, d.device_name, d.serial_number, d.fam_tag, ea.assigned_date, ea.remarks
      FROM employee_assets ea JOIN devices d ON d.id = ea.device_id
      WHERE ea.employee_id = ?
    `, [id]);

    const rows = assets.map(a => ({
      EmployeeName: emp.name,
      EmployeeID: emp.employee_id,
      Position: emp.position,
      Department: emp.department,
      DeviceType: a.device_type,
      DeviceName: a.device_name,
      SerialNumber: a.serial_number,
      FAMTag: a.fam_tag,
      AssignedDate: a.assigned_date
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${emp.employee_id}_${emp.name}_assets.csv`);
    res.send(csv);
  }catch(err){ res.status(500).json({error: err.message});}
});

module.exports = router;

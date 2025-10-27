import React from 'react';
import api from '../api';

export default function TransmittalForm(){
  const [devices, setDevices] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [form, setForm] = React.useState({
    trans_type: 'OUT', device_id:'', qty:1, remarks:'', employee_id:'', signature:null
  });

  React.useEffect(()=>{
    api.get('/devices').then(r=> setDevices(r.data)).catch(()=>{});
    api.get('/employees').then(r=> setEmployees(r.data)).catch(()=>{});
  },[]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=> setForm({...form, signature: reader.result});
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    const d = devices.find(x=> x.id == form.device_id);
    if(!d) return alert('select device');
    try{
      await api.post('/transmittals', {
        trans_type: form.trans_type,
        device_id: d.id,
        device_name: d.device_name,
        serial_number: d.serial_number,
        fam_tag: d.fam_tag,
        qty: form.qty,
        remarks: form.remarks,
        employee_id: form.employee_id || null,
        signature: form.signature
      });
      alert('Transmittal recorded');
    }catch(e){
      alert('Error saving transmittal');
    }
  };

  return (
    <div className="card">
      <div className="card-header">Transmittal (IN / OUT)</div>
      <div className="card-body">
        <div className="row g-2">
          <div className="col-md-3">
            <select className="form-select" value={form.trans_type} onChange={e=> setForm({...form, trans_type: e.target.value})}>
              <option value="OUT">OUT</option>
              <option value="IN">IN</option>
            </select>
          </div>
          <div className="col-md-5">
            <select className="form-select" value={form.device_id} onChange={e=> setForm({...form, device_id: e.target.value})}>
              <option value="">Select device</option>
              {devices.map(d=> <option key={d.id} value={d.id}>{d.device_name} — {d.fam_tag}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" value={form.qty} onChange={e=> setForm({...form, qty: e.target.value})}/>
          </div>
          <div className="col-md-12 mt-2">
            <select className="form-select" value={form.employee_id} onChange={e=> setForm({...form, employee_id: e.target.value})}>
              <option value="">Select employee (optional)</option>
              {employees.map(emp=> <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          </div>
          <div className="col-md-12 mt-2">
            <textarea className="form-control" placeholder="Remarks" value={form.remarks} onChange={e=> setForm({...form, remarks: e.target.value})}></textarea>
          </div>
          <div className="col-md-6 mt-2">
            <input type="file" accept="image/*" onChange={handleFile}/>
            <small className="d-block">Signature image (optional)</small>
          </div>
          <div className="col-md-12 mt-3">
            <button className="btn btn-primary" onClick={submit}>Submit Transmittal</button>
          </div>
        </div>
      </div>
    </div>
  );
}

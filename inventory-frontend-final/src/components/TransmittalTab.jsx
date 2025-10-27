import React from 'react';
import api from '../api';

export default function TransmittalTab(){
  const [employees, setEmployees] = React.useState([]);
  const [devices, setDevices] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [form, setForm] = React.useState({employee_id:'',trans_type:'OUT',date_trans:'',remarks:'',signature:'', devices:[]});
  const [q,setQ] = React.useState('');

  React.useEffect(()=>{
    api.get('/employees').then(r=> setEmployees(r.data)).catch(()=>{});
    api.get('/devices',{params:{q:'',type:''}}).then(r=> setDevices(r.data)).catch(()=>{});
    loadList();
  },[]);

  const loadList = ()=> api.get('/transmittals',{params:{q}}).then(r=> setList(r.data)).catch(()=>{});

  const addDeviceRow = ()=> setForm({...form, devices: [...form.devices, {device_id:''} ]});

  const submit = async ()=>{
    try{
      await api.post('/transmittals', form);
      setForm({employee_id:'',trans_type:'OUT',date_trans:'',remarks:'',signature:'', devices:[]});
      loadList();
      api.get('/devices',{params:{q:'',type:''}}).then(r=> setDevices(r.data));
      alert('Saved');
    }catch(e){ alert('Error saving'); }
  };

  const toggleDevice = (idx, val)=>{
    const arr = [...form.devices];
    arr[idx].device_id = val;
    setForm({...form, devices:arr});
  };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header">New Transmittal</div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3"><select className="form-select" value={form.employee_id} onChange={e=>setForm({...form,employee_id:e.target.value})}><option value="">Select employee</option>{employees.map(emp=> <option key={emp.id} value={emp.id}>{emp.name} - {emp.employee_id}</option>)}</select></div>
            <div className="col-md-2"><select className="form-select" value={form.trans_type} onChange={e=>setForm({...form,trans_type:e.target.value})}><option value="OUT">OUT</option><option value="IN">IN</option></select></div>
            <div className="col-md-3"><input type="date" className="form-control" value={form.date_trans} onChange={e=>setForm({...form,date_trans:e.target.value})} /></div>
            <div className="col-md-4"><input className="form-control" placeholder="Signature (text)" value={form.signature} onChange={e=>setForm({...form,signature:e.target.value})} /></div>
          </div>
          <div className="mt-2">
            <label className="form-label">Devices</label>
            {form.devices.map((d,idx)=> (
              <div className="d-flex mb-2" key={idx}>
                <select className="form-select me-2" value={d.device_id} onChange={e=>toggleDevice(idx,e.target.value)}>
                  <option value="">Select device</option>
                  {devices.filter(x=> x.status === 'available' || form.trans_type === 'IN').map(dev=> <option key={dev.id} value={dev.id}>{dev.device_name} - {dev.fam_tag} ({dev.status})</option>)}
                </select>
                <button className="btn btn-danger" onClick={()=>{ const arr=[...form.devices]; arr.splice(idx,1); setForm({...form,devices:arr}); }}>Remove</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={addDeviceRow}>Add device</button>
          </div>
          <div className="mt-2"><textarea className="form-control" placeholder="Remarks" value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})}></textarea></div>
          <div className="mt-2"><button className="btn btn-primary" onClick={submit}>Save Transmittal</button> <a className="btn btn-outline-success ms-2" href="http://localhost:4000/api/transmittals/export/csv">Export CSV</a></div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{maxHeight:300, overflow:'auto'}}>
          <table className="table">
            <thead><tr><th>No</th><th>Trans No</th><th>Employee</th><th>Type</th><th>Date</th><th>Devices</th></tr></thead>
            <tbody>
              {list.map(l=> <tr key={l.id}><td>{l.id}</td><td>{l.transmittal_no}</td><td>{l.employee_name}</td><td>{l.trans_type}</td><td>{new Date(l.date_trans||l.created_at).toLocaleDateString()}</td><td>{l.device_count}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

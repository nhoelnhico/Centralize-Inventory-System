import React from 'react';
import api from '../api';

export default function DevicesTab(){
  const [type,setType] = React.useState('laptop');
  const [form, setForm] = React.useState({device_type:'laptop',brand:'',model:'',device_name:'',serial_number:'',fam_tag:'',remarks:''});
  const [list,setList] = React.useState([]);

  const load = ()=> api.get('/devices',{params:{type}}).then(r=> setList(r.data)).catch(()=>{});
  React.useEffect(()=> load(),[type]);

  const submit = async ()=>{
    try{
      await api.post('/devices', form);
      setForm({device_type:type,brand:'',model:'',device_name:'',serial_number:'',fam_tag:'',remarks:''});
      load();
    }catch(e){ alert('Error'); }
  };

  const del = async (id)=>{ if(!confirm('Delete device?')) return; await api.delete('/devices/'+id); load(); };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header">Add {type.charAt(0).toUpperCase()+type.slice(1)}</div>
        <div className="card-body">
          <div className="d-flex mb-2">
            <select className="form-select w-25 me-2" value={type} onChange={e=>{ setType(e.target.value); setForm({...form,device_type:e.target.value}); }}>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="phone">Company Phone</option>
              <option value="other">Other</option>
            </select>
            <input className="form-control me-2" placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} />
            <input className="form-control me-2" placeholder="Model" value={form.model} onChange={e=>setForm({...form,model:e.target.value})} />
            <input className="form-control me-2" placeholder="Device Name" value={form.device_name} onChange={e=>setForm({...form,device_name:e.target.value})} />
          </div>
          <div className="d-flex">
            <input className="form-control me-2" placeholder="Serial Number" value={form.serial_number} onChange={e=>setForm({...form,serial_number:e.target.value})} />
            <input className="form-control me-2" placeholder="FAM Tag" value={form.fam_tag} onChange={e=>setForm({...form,fam_tag:e.target.value})} />
            <input className="form-control me-2" placeholder="Remarks" value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})} />
            <button className="btn btn-primary" onClick={submit}>Add</button>
          </div>
        </div>
      </div>

      <div className="mb-2 d-flex justify-content-between">
        <div></div>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={load}>Refresh</button>
          <a className="btn btn-outline-success" href="http://localhost:4000/api/devices/export/csv">Export CSV</a>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{maxHeight:350, overflow:'auto'}}>
          <table className="table">
            <thead><tr><th>Type</th><th>Name</th><th>Brand</th><th>Serial</th><th>FAM</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map(l=> <tr key={l.id}><td>{l.device_type}</td><td>{l.device_name}</td><td>{l.brand}</td><td>{l.serial_number}</td><td>{l.fam_tag}</td><td>{l.status}</td><td><button className="btn btn-sm btn-outline-danger" onClick={()=>del(l.id)}>Delete</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import api from '../api';

export default function InventoryTab(){
  const [list,setList] = React.useState([]);
  const [q,setQ] = React.useState('');
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({device_type:'',brand:'',model:'',device_name:'',serial_number:'',fam_tag:'',remarks:'',status:''});

  const load = ()=> api.get('/devices',{params:{q}}).then(r=> setList(r.data)).catch(()=>{});
  React.useEffect(()=> load(),[]);

  const startEdit = (item)=>{
    setEditing(item.id);
    setForm({...item});
    const modal = new window.bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  };

  const save = async ()=>{
    try{
      await api.put('/devices/'+editing, form);
      setEditing(null);
      const modalEl = document.getElementById('editModal');
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      load();
    }catch(e){ alert('Error'); }
  };

  const del = async (id)=>{ if(!confirm('Delete device?')) return; await api.delete('/devices/'+id); load(); };

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <input className="form-control w-50" placeholder="Search inventory..." value={q} onChange={e=>setQ(e.target.value)} />
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={load}>Refresh</button>
          <a className="btn btn-outline-success" href="http://localhost:4000/api/downloads/inventory/csv">Export CSV</a>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{maxHeight:400, overflow:'auto'}}>
          <table className="table">
            <thead><tr><th>Type</th><th>Name</th><th>Serial</th><th>FAM</th><th>Assigned</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map(l=> <tr key={l.id}><td>{l.device_type}</td><td>{l.device_name}</td><td>{l.serial_number}</td><td>{l.fam_tag}</td><td>{l.assigned_employee_name||''}</td><td>{l.status}</td><td><button className="btn btn-sm btn-outline-primary me-1" onClick={()=>startEdit(l)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>del(l.id)}>Delete</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title">Edit Device</h5><button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
            <div className="modal-body">
              <div className="mb-2"><select className="form-select" value={form.device_type} onChange={e=>setForm({...form,device_type:e.target.value})}><option value="">Type</option><option value="laptop">Laptop</option><option value="desktop">Desktop</option><option value="phone">Company Phone</option><option value="other">Other</option></select></div>
              <div className="mb-2"><input className="form-control" placeholder="Brand" value={form.brand||''} onChange={e=>setForm({...form,brand:e.target.value})} /></div>
              <div className="mb-2"><input className="form-control" placeholder="Model" value={form.model||''} onChange={e=>setForm({...form,model:e.target.value})} /></div>
              <div className="mb-2"><input className="form-control" placeholder="Device Name" value={form.device_name||''} onChange={e=>setForm({...form,device_name:e.target.value})} /></div>
              <div className="mb-2"><input className="form-control" placeholder="Serial Number" value={form.serial_number||''} onChange={e=>setForm({...form,serial_number:e.target.value})} /></div>
              <div className="mb-2"><input className="form-control" placeholder="FAM Tag" value={form.fam_tag||''} onChange={e=>setForm({...form,fam_tag:e.target.value})} /></div>
              <div className="mb-2"><input className="form-control" placeholder="Remarks" value={form.remarks||''} onChange={e=>setForm({...form,remarks:e.target.value})} /></div>
              <div className="mb-2"><select className="form-select" value={form.status||''} onChange={e=>setForm({...form,status:e.target.value})}><option value="available">Available</option><option value="in_use">In Use</option><option value="returned">Returned</option><option value="disposed">Disposed</option></select></div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" data-bs-dismiss="modal">Close</button><button className="btn btn-primary" onClick={save}>Save</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}

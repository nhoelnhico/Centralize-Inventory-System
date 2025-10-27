import React from 'react';
import api from '../api';

export default function EmployeesTab(){
  const [list,setList] = React.useState([]);
  const [q,setQ] = React.useState('');
  const [form, setForm] = React.useState({employee_id:'',name:'',position:'',department:'',date_hired:'',email:''});
  const [editing, setEditing] = React.useState(null);

  const load = ()=> api.get('/employees',{params:{q}}).then(r=> setList(r.data)).catch(()=>{});
  React.useEffect(()=> load(),[]);

  const submit = async ()=>{
    try{
      if(editing){
        await api.put('/employees/'+editing, form);
        setEditing(null);
      } else {
        await api.post('/employees', form);
      }
      setForm({employee_id:'',name:'',position:'',department:'',date_hired:'',email:''});
      load();
    }catch(e){ alert('Error'); }
  };

  const startEdit = (item)=>{
    setEditing(item.id);
    setForm({employee_id:item.employee_id,name:item.name,position:item.position,department:item.department,date_hired:item.date_hired?item.date_hired.split('T')[0]:'',email:item.email||''});
  };

  const del = async (id)=>{ if(!confirm('Delete employee?')) return; await api.delete('/employees/'+id); load(); };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header">Add / Edit Employee</div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-3"><input className="form-control" placeholder="Employee ID" value={form.employee_id} onChange={e=>setForm({...form,employee_id:e.target.value})} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})} /></div>
            <div className="col-md-2"><input className="form-control" placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} /></div>
            <div className="col-md-2"><input type="date" className="form-control" value={form.date_hired} onChange={e=>setForm({...form,date_hired:e.target.value})} /></div>
            <div className="col-md-4 mt-2"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            <div className="col-md-2 mt-2"><button className="btn btn-primary" onClick={submit}>{editing?'Update':'Add'}</button></div>
          </div>
        </div>
      </div>

      <div className="mb-2 d-flex justify-content-between">
        <input className="form-control w-50" placeholder="Search employees..." value={q} onChange={e=>setQ(e.target.value)} />
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={()=>load()}>Refresh</button>
          <a className="btn btn-outline-success" href="http://localhost:4000/api/downloads/employees/csv">Export CSV</a>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{maxHeight:350, overflow:'auto'}}>
          <table className="table">
            <thead><tr><th>Emp ID</th><th>Name</th><th>Pos</th><th>Dept</th><th>Email</th><th></th></tr></thead>
            <tbody>
              {list.map(l=> <tr key={l.id}><td>{l.employee_id}</td><td>{l.name}</td><td>{l.position}</td><td>{l.department}</td><td>{l.email}</td><td><button className="btn btn-sm btn-outline-primary me-1" onClick={()=>startEdit(l)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={()=>del(l.id)}>Delete</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

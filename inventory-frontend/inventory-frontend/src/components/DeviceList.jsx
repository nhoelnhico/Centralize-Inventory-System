import React from 'react';
import api from '../api';

export default function DeviceList(){
  const [devices, setDevices] = React.useState([]);
  const [q,setQ] = React.useState('');
  React.useEffect(()=> { load(); }, []);
  const load = ()=> api.get('/devices').then(r=> setDevices(r.data)).catch(()=>{});

  const handleSearch = ()=> api.get('/devices',{params:{q}}).then(r=> setDevices(r.data)).catch(()=>{});

  return (
    <div className="card mb-3">
      <div className="card-header">Device Inventory</div>
      <div className="card-body">
        <div className="input-group mb-2">
          <input className="form-control" placeholder="search..." value={q} onChange={e=> setQ(e.target.value)} />
          <button className="btn btn-outline-secondary" onClick={handleSearch}>Search</button>
        </div>
        <ul style={{maxHeight:200,overflow:'auto'}} className="list-group">
          {devices.map(d=> (
            <li className="list-group-item" key={d.id}>
              <strong>{d.device_name}</strong> <small>({d.device_type})</small><br/>
              <small>Serial: {d.serial_number} | FAM: {d.fam_tag} | Status: {d.status}</small>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

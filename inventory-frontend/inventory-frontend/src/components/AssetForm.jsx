import React from 'react';
import api from '../api';

export default function AssetForm({employeeId}){
  const [devices, setDevices] = React.useState([]);
  const [deviceId, setDeviceId] = React.useState('');
  React.useEffect(()=> {
    api.get('/devices').then(r=> setDevices(r.data)).catch(()=>{});
  },[]);

  const handleAssign = async () => {
    if(!employeeId || !deviceId) return alert('Select employee and device');
    const d = devices.find(x=> x.id == deviceId);
    try{
      await api.post('/transmittals', {
        trans_type: 'OUT',
        device_id: d.id,
        device_name: d.device_name,
        serial_number: d.serial_number,
        fam_tag: d.fam_tag,
        qty: 1,
        remarks: 'Assigned via AssetForm',
        employee_id: employeeId,
        signature: null
      });
      alert('Assigned');
    }catch(e){
      alert('Error assigning');
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">Assign Device to Employee</div>
      <div className="card-body">
        <div className="mb-2">
          <select className="form-select" value={deviceId} onChange={e=> setDeviceId(e.target.value)}>
            <option value="">Choose device</option>
            {devices.filter(d=> d.status === 'available').map(d=> (
              <option key={d.id} value={d.id}>{d.device_name} — {d.fam_tag}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleAssign}>Assign (OUT)</button>
      </div>
    </div>
  );
}

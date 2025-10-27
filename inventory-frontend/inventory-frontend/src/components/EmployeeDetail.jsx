import React from 'react';
import api from '../api';

export default function EmployeeDetail({employeeId}){
  const [data, setData] = React.useState(null);
  React.useEffect(()=>{
    if(!employeeId) return;
    api.get(`/employees/${employeeId}`).then(r=> setData(r.data)).catch(()=>{});
  },[employeeId]);

  if(!data) return null;
  const { employee, assets } = data;

  const handleDownload = () => {
    window.open(`http://localhost:4000/api/downloads/employee/${employee.id}`, '_blank');
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between">
        <div>{employee.name} — {employee.employee_id}</div>
        <div><button className="btn btn-sm btn-success" onClick={handleDownload}>Download CSV</button></div>
      </div>
      <div className="card-body">
        <p><strong>Position:</strong> {employee.position} <br/> <strong>Department:</strong> {employee.department}</p>
        <h6>Assigned Assets</h6>
        <ul>
          {assets.length === 0 && <li>No assets</li>}
          {assets.map(a=> (
            <li key={a.id}>{a.device_type} — {a.device_name} (FAM: {a.fam_tag})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

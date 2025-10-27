import React from 'react';
import api from '../api';

export default function EmployeeList({onSelect}){
  const [list, setList] = React.useState([]);
  React.useEffect(()=> {
    api.get('/employees').then(r=> setList(r.data)).catch(()=>{});
  },[]);
  return (
    <div className="card mb-3">
      <div className="card-header">Employees</div>
      <ul className="list-group list-group-flush" style={{maxHeight: '350px', overflow:'auto'}}>
        {list.map(e=> (
          <li key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{e.name}</strong><br/>
              <small>{e.position} - {e.department}</small>
            </div>
            <button className="btn btn-sm btn-outline-primary" onClick={()=> onSelect(e.id)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

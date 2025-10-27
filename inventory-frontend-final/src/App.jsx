import React from 'react';
import EmployeesTab from './components/EmployeesTab';
import DevicesTab from './components/DevicesTab';
import InventoryTab from './components/InventoryTab';
import TransmittalTab from './components/TransmittalTab';

export default function App(){
  const [active, setActive] = React.useState('employees');
  return (
    <div className="container py-4">
      <h2>Centralized Inventory</h2>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item"><button className={'nav-link '+(active==='employees'?'active':'')} onClick={()=>setActive('employees')}>Employees</button></li>
        <li className="nav-item"><button className={'nav-link '+(active==='devices'?'active':'')} onClick={()=>setActive('devices')}>Devices</button></li>
        <li className="nav-item"><button className={'nav-link '+(active==='inventory'?'active':'')} onClick={()=>setActive('inventory')}>Inventory</button></li>
        <li className="nav-item"><button className={'nav-link '+(active==='transmittal'?'active':'')} onClick={()=>setActive('transmittal')}>Transmittal</button></li>
      </ul>
      {active === 'employees' && <EmployeesTab />}
      {active === 'devices' && <DevicesTab />}
      {active === 'inventory' && <InventoryTab />}
      {active === 'transmittal' && <TransmittalTab />}
    </div>
  );
}

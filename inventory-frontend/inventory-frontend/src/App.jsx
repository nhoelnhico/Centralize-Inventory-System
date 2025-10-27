import React from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import DeviceList from './components/DeviceList';
import AssetForm from './components/AssetForm';
import TransmittalForm from './components/TransmittalForm';

export default function App(){
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  return (
    <div className="container py-4">
      <h2>Centralized Inventory Assets</h2>
      <div className="row">
        <div className="col-md-4">
          <EmployeeList onSelect={setSelectedEmployee}/>
          <DeviceList/>
        </div>
        <div className="col-md-8">
          {selectedEmployee ? (
            <EmployeeDetail employeeId={selectedEmployee} />
          ) : (
            <div className="mb-3">Select an employee to view details</div>
          )}
          <AssetForm employeeId={selectedEmployee}/>
          <div className="mt-3">
            <TransmittalForm />
          </div>
        </div>
      </div>
    </div>
  );
}

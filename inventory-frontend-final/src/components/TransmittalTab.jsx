import { useState, useEffect } from "react";
import api from "../api";

export default function TransmittalTab({ search }) {
  const [employees, setEmployees] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [list, setList] = useState([]);

  const [form, setForm] = useState({
    from_employee_id: "",
    to_employee_id: "",
    items: [{ device_id: "" }],
    remarks: "",
    signature: "",
  });

  // 🔹 Load initial data
  useEffect(() => {
    loadEmployees();
    loadAvailableDevices();
    loadTransmittals();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error loading employees", err);
    }
  };

  const loadAvailableDevices = async () => {
    try {
      const res = await api.get("/devices/available");
      setAvailableDevices(res.data);
    } catch (err) {
      console.error("Error loading available devices", err);
    }
  };

  const loadTransmittals = async () => {
    try {
      const res = await api.get("/transmittal");
      setList(res.data);
    } catch (err) {
      console.error("Error loading transmittals", err);
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { device_id: "" }],
    });
  };

  const submit = async () => {
    if (!form.from_employee_id || !form.to_employee_id) {
      alert("Please select both From and To employees.");
      return;
    }
    try {
      await api.post("/transmittal", form);
      setForm({
        from_employee_id: "",
        to_employee_id: "",
        items: [{ device_id: "" }],
        remarks: "",
        signature: "",
      });
      loadTransmittals();
      loadAvailableDevices();
    } catch (err) {
      console.error("Error submitting transmittal", err);
    }
  };

  return (
    <div>
      <h4>Transmittal</h4>

      <div className="card mb-3">
        <div className="card-header">New Transmittal</div>
        <div className="card-body">
          {/* Employee From-To */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">From Employee</label>
              <select
                className="form-select"
                value={form.from_employee_id}
                onChange={(e) => setForm({ ...form, from_employee_id: e.target.value })}
              >
                <option value="">Select...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">To Employee</label>
              <select
                className="form-select"
                value={form.to_employee_id}
                onChange={(e) => setForm({ ...form, to_employee_id: e.target.value })}
              >
                <option value="">Select...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Devices Dropdown */}
          <label className="form-label">Devices</label>
          {form.items.map((item, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <select
                className="form-select"
                value={item.device_id}
                onChange={(e) => {
                  const items = [...form.items];
                  items[i].device_id = e.target.value;
                  setForm({ ...form, items });
                }}
              >
                <option value="">Select Device...</option>
                {availableDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.device_name} ({d.device_type}) - SN:{d.serial_number}
                  </option>
                ))}
              </select>
              {i === form.items.length - 1 && (
                <button className="btn btn-outline-secondary" onClick={addItem}>
                  + Add
                </button>
              )}
            </div>
          ))}

          <input
            className="form-control mb-2"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
          <input
            className="form-control mb-3"
            placeholder="Employee Signature (text)"
            value={form.signature}
            onChange={(e) => setForm({ ...form, signature: e.target.value })}
          />
          <button className="btn btn-primary" onClick={submit}>
            Save Transmittal
          </button>
        </div>
      </div>

      {/* Table of Transmittals */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Devices</th>
            <th>Remarks</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          {list
            .filter((t) =>
              JSON.stringify(t).toLowerCase().includes(search.toLowerCase())
            )
            .map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.from_employee_name || t.from_employee_id}</td>
                <td>{t.to_employee_name || t.to_employee_id}</td>
                <td>
                  {t.devices
                    ? t.devices.map((d) => d.device_name).join(", ")
                    : "—"}
                </td>
                <td>{t.remarks}</td>
                <td>{t.signature}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

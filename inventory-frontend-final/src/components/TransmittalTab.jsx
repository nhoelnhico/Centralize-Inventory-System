import React, { useState, useEffect } from "react";
import api from "../api";

export default function TransmittalTab() {
  const [form, setForm] = useState({
    employee_id: "",
    items: [{ device_name: "", serial_number: "", fam_tag: "" }],
    remarks: "",
    signature: "",
  });
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await api.get("/transmittal");
    setList(res.data);
  };

  useEffect(() => load(), []);

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { device_name: "", serial_number: "", fam_tag: "" }],
    });
  };

  const submit = async () => {
    await api.post("/transmittal", form);
    setForm({
      employee_id: "",
      items: [{ device_name: "", serial_number: "", fam_tag: "" }],
      remarks: "",
      signature: "",
    });
    load();
  };

  return (
    <div>
      <h4>Transmittal</h4>

      <div className="card mb-3">
        <div className="card-header">Add Transmittal</div>
        <div className="card-body">
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Employee ID"
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
            />
          </div>
          {form.items.map((item, i) => (
            <div key={i} className="d-flex gap-2 mb-2">
              <input
                className="form-control"
                placeholder="Device Name"
                value={item.device_name}
                onChange={(e) => {
                  const items = [...form.items];
                  items[i].device_name = e.target.value;
                  setForm({ ...form, items });
                }}
              />
              <input
                className="form-control"
                placeholder="Serial Number"
                value={item.serial_number}
                onChange={(e) => {
                  const items = [...form.items];
                  items[i].serial_number = e.target.value;
                  setForm({ ...form, items });
                }}
              />
              <input
                className="form-control"
                placeholder="FAM Tag"
                value={item.fam_tag}
                onChange={(e) => {
                  const items = [...form.items];
                  items[i].fam_tag = e.target.value;
                  setForm({ ...form, items });
                }}
              />
            </div>
          ))}
          <button className="btn btn-outline-secondary mb-2" onClick={addItem}>
            + Add Another Device
          </button>
          <input
            className="form-control mb-2"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Employee Signature (text)"
            value={form.signature}
            onChange={(e) => setForm({ ...form, signature: e.target.value })}
          />
          <button className="btn btn-primary" onClick={submit}>
            Save
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Devices</th>
                <th>Remarks</th>
                <th>Signature</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td>{t.employee_id}</td>
                  <td>{t.items?.map((i) => i.device_name).join(", ")}</td>
                  <td>{t.remarks}</td>
                  <td>{t.signature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

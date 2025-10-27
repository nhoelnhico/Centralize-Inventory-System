import React, { useEffect, useState } from "react";
import api from "../api";

export default function DevicesTab() {
  const [type, setType] = useState("laptop");
  const [form, setForm] = useState({
    device_type: "laptop",
    brand: "",
    model: "",
    device_name: "",
    serial_number: "",
    fam_tag: "",
    remarks: "",
  });
  const [list, setList] = useState([]);

  const load = async () => {
    try {
      const res = await api.get("/devices", { params: { type } });
      setList(res.data);
    } catch {
      console.log("Load error");
    }
  };

  useEffect(() => load(), [type]);

  const submit = async () => {
    await api.post("/devices", form);
    setForm({
      device_type: type,
      brand: "",
      model: "",
      device_name: "",
      serial_number: "",
      fam_tag: "",
      remarks: "",
    });
    load();
  };

  const del = async (id) => {
    if (!window.confirm("Delete device?")) return;
    await api.delete(`/devices/${id}`);
    load();
  };

  return (
    <div>
      <div className="card mb-3">
        <div className="card-header">Add {type}</div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <select
              className="form-select w-auto"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setForm({ ...form, device_type: e.target.value });
              }}
            >
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="phone">Company Phone</option>
              <option value="other">Other</option>
            </select>
            <input
              className="form-control"
              placeholder="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="Device Name"
              value={form.device_name}
              onChange={(e) => setForm({ ...form, device_name: e.target.value })}
            />
          </div>
          <div className="d-flex flex-wrap gap-2">
            <input
              className="form-control"
              placeholder="Serial Number"
              value={form.serial_number}
              onChange={(e) =>
                setForm({ ...form, serial_number: e.target.value })
              }
            />
            <input
              className="form-control"
              placeholder="FAM Tag"
              value={form.fam_tag}
              onChange={(e) => setForm({ ...form, fam_tag: e.target.value })}
            />
            <input
              className="form-control"
              placeholder="Remarks"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
            <button className="btn btn-primary" onClick={submit}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Serial</th>
                <th>FAM</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((l) => (
                <tr key={l.id}>
                  <td>{l.device_type}</td>
                  <td>{l.device_name}</td>
                  <td>{l.brand}</td>
                  <td>{l.serial_number}</td>
                  <td>{l.fam_tag}</td>
                  <td>{l.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => del(l.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

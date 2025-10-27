import React, { useState, useEffect } from "react";
import api from "../api";

export default function DevicesTab({ search }) {
  const [type, setType] = useState("laptop");
  const [form, setForm] = useState({ device_type: "laptop", brand: "", model: "", device_name: "", serial_number: "", fam_tag: "", remarks: "" });
  const [list, setList] = useState([]);

  const load = async () => {
    const res = await api.get("/devices", { params: { type } });
    setList(res.data);
  };
  useEffect(() => { load(); }, [type]);

  const submit = async () => {
    await api.post("/devices", form);
    setForm({ ...form, brand: "", model: "", device_name: "", serial_number: "", fam_tag: "", remarks: "" });
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
        <div className="card-header">Add Device</div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <select className="form-select w-auto" value={type} onChange={(e) => { setType(e.target.value); setForm({ ...form, device_type: e.target.value }); }}>
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="phone">Company Phone</option>
              <option value="other">Other</option>
            </select>
            {["brand", "model", "device_name"].map((f) => (
              <input key={f} className="form-control" placeholder={f} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2">
            {["serial_number", "fam_tag", "remarks"].map((f) => (
              <input key={f} className="form-control" placeholder={f.replace("_", " ")} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            ))}
            <button className="btn btn-primary" onClick={submit}>Add</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-bordered">
            <thead>
              <tr><th>Type</th><th>Name</th><th>Brand</th><th>Serial</th><th>FAM</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {list
                .filter((l) => Object.values(l).join(" ").toLowerCase().includes(search.toLowerCase()))
                .map((l) => (
                  <tr key={l.id}>
                    <td>{l.device_type}</td>
                    <td>{l.device_name}</td>
                    <td>{l.brand}</td>
                    <td>{l.serial_number}</td>
                    <td>{l.fam_tag}</td>
                    <td>{l.status}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => del(l.id)}>Delete</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

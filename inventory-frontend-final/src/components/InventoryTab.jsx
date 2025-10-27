import React, { useEffect, useState } from "react";
import api from "../api";

export default function InventoryTab({ search }) {
  const [devices, setDevices] = useState([]);

  const load = async () => {
    const res = await api.get("/devices");
    setDevices(res.data);
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mb-2">
        <h4>Inventory</h4>
        <a href="http://localhost:4000/api/devices/export/csv" className="btn btn-outline-success">
          Export CSV
        </a>
      </div>
      <table className="table table-striped">
        <thead>
          <tr><th>Type</th><th>Device</th><th>Brand</th><th>Serial</th><th>FAM</th><th>Status</th></tr>
        </thead>
        <tbody>
          {devices
            .filter((d) => Object.values(d).join(" ").toLowerCase().includes(search.toLowerCase()))
            .map((d) => (
              <tr key={d.id}>
                <td>{d.device_type}</td>
                <td>{d.device_name}</td>
                <td>{d.brand}</td>
                <td>{d.serial_number}</td>
                <td>{d.fam_tag}</td>
                <td>{d.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

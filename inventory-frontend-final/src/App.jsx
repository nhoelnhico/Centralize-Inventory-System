import React, { useState } from "react";
import EmployeesTab from "./components/EmployeesTab";
import DevicesTab from "./components/DevicesTab";
import InventoryTab from "./components/InventoryTab";
import TransmittalTab from "./components/TransmittalTab";

export default function App() {
  const [active, setActive] = useState("employees");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const handleTabChange = (tab) => {
    setActive(tab);
    setReloadKey((k) => k + 1);
    setSearch("");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Centralized Inventory System</h2>
        <input
          type="text"
          className="form-control w-25"
          placeholder="🔍 Global Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="nav nav-tabs mb-3">
        {["employees", "devices", "inventory", "transmittal"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${active === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {active === "employees" && <EmployeesTab key={reloadKey} search={search} />}
      {active === "devices" && <DevicesTab key={reloadKey} search={search} />}
      {active === "inventory" && <InventoryTab key={reloadKey} search={search} />}
      {active === "transmittal" && <TransmittalTab key={reloadKey} search={search} />}
    </div>
  );
}

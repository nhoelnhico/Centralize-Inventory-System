import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";

export default function TransmittalTab() {
  const [trans, setTrans] = useState([]);
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    employee_name: "",
    transaction_type: "",
    selectedDevices: [],
    date_issued: "",
    status: "",
    signature: "",
  });

  // Fetch data
  useEffect(() => {
    fetchTrans();
    fetchDevices();
    fetchLogs();
  }, []);

  const fetchTrans = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/transmittals");
      setTrans(res.data);
    } catch (err) {
      console.error("Error fetching transmittals:", err);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/devices");
      setDevices(res.data);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/activitylogs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (
        !form.employee_name ||
        !form.transaction_type ||
        form.selectedDevices.length === 0
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      const payload = {
        employee_name: form.employee_name,
        device_list: form.selectedDevices.join(", "),
        transaction_type: form.transaction_type,
        date_issued: form.date_issued,
        status: form.status,
        signature: form.signature,
      };

      if (editing) {
        await axios.put(
          `http://localhost:4000/api/transmittals/${editing.id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:4000/api/transmittals", payload);
      }

      // Update device statuses based on In/Out
      for (const deviceId of form.selectedDevices) {
        await axios.put(`http://localhost:4000/api/devices/${deviceId}`, {
          status: form.transaction_type === "Out" ? "in_use" : "available",
        });

        // Log activity
        const selectedDevice = devices.find(
          (d) => d.id.toString() === deviceId.toString()
        );
        const logMessage =
          form.transaction_type === "Out"
            ? `${form.employee_name} checked out ${selectedDevice.device_name}`
            : `${form.employee_name} returned ${selectedDevice.device_name}`;

        await axios.post("http://localhost:4000/api/activitylogs", {
          message: logMessage,
          date: new Date().toISOString().split("T")[0],
        });
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchTrans();
      fetchDevices();
      fetchLogs();
    } catch (err) {
      console.error("Error saving transmittal:", err);
      alert("Failed to save transmittal. Check console for details.");
    }
  };

  const handleEdit = (t) => {
    setEditing(t);
    setForm({
      employee_name: t.employee_name,
      transaction_type: t.transaction_type,
      selectedDevices: t.device_list
        ? t.device_list.split(", ").map((d) => d.trim())
        : [],
      date_issued: t.date_issued || "",
      status: t.status || "",
      signature: t.signature || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transmittal?"))
      return;
    try {
      await axios.delete(`http://localhost:4000/api/transmittals/${id}`);
      fetchTrans();
    } catch (err) {
      console.error("Error deleting transmittal:", err);
    }
  };

  const resetForm = () => {
    setForm({
      employee_name: "",
      transaction_type: "",
      selectedDevices: [],
      date_issued: "",
      status: "",
      signature: "",
    });
  };

  const handleDeviceSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setForm({ ...form, selectedDevices: selected });
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Transmittals</h4>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Transmittal
        </Button>
      </div>

      {/* TRANSMITTAL TABLE */}
      <Table striped bordered hover>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Transaction</th>
            <th>Devices</th>
            <th>Date</th>
            <th>Status</th>
            <th>Signature</th>
            <th style={{ width: "140px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trans.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.employee_name}</td>
              <td>{t.transaction_type}</td>
              <td>{t.device_list}</td>
              <td>{t.date_issued}</td>
              <td>{t.status}</td>
              <td>{t.signature}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ACTIVITY LOGS */}
      <h5 className="mt-5 mb-3">Activity Logs</h5>
      <Table striped bordered hover>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.message}</td>
              <td>{log.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? "Edit Transmittal" : "Add Transmittal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                value={form.employee_name}
                onChange={(e) =>
                  setForm({ ...form, employee_name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                value={form.transaction_type}
                onChange={(e) =>
                  setForm({ ...form, transaction_type: e.target.value })
                }
              >
                <option value="">Select Transaction Type</option>
                <option value="Out">Out (Device Borrowed)</option>
                <option value="In">In (Device Returned)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Select Devices</Form.Label>
              <Form.Control
                as="select"
                multiple
                value={form.selectedDevices}
                onChange={handleDeviceSelect}
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.device_name} ({d.serial_number}) - {d.status}
                  </option>
                ))}
              </Form.Control>
              <small className="text-muted">
                Hold <b>Ctrl</b> (Windows) or <b>Cmd</b> (Mac) to select multiple.
              </small>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={form.date_issued}
                onChange={(e) =>
                  setForm({ ...form, date_issued: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Completed, Pending"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Signature</Form.Label>
              <Form.Control
                type="text"
                value={form.signature}
                onChange={(e) => setForm({ ...form, signature: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

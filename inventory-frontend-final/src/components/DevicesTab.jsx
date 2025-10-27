import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";

export default function DevicesTab() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    device_name: "",
    serial_number: "",
    category: "",
    status: "available",
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/devices");
      setDevices(res.data);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (!form.device_name || !form.serial_number) {
        alert("Device name and serial number are required.");
        return;
      }

      if (editing) {
        await axios.put(
          `http://localhost:4000/api/devices/${editing.id}`,
          form
        );
      } else {
        await axios.post("http://localhost:4000/api/devices", form);
      }

      setShowModal(false);
      setEditing(null);
      setForm({
        device_name: "",
        serial_number: "",
        category: "",
        status: "available",
      });
      fetchDevices();
    } catch (err) {
      console.error("Error saving device:", err);
      alert("Failed to save device. Check console for details.");
    }
  };

  const handleEdit = (device) => {
    setEditing(device);
    setForm({
      device_name: device.device_name,
      serial_number: device.serial_number,
      category: device.category,
      status: device.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/devices/${id}`);
      fetchDevices();
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Devices</h4>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setForm({
              device_name: "",
              serial_number: "",
              category: "",
              status: "available",
            });
            setShowModal(true);
          }}
        >
          + Add Device
        </Button>
      </div>

      <Table striped bordered hover>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Device Name</th>
            <th>Serial Number</th>
            <th>Category</th>
            <th>Status</th>
            <th style={{ width: "140px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.device_name}</td>
              <td>{d.serial_number}</td>
              <td>{d.category}</td>
              <td>{d.status}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(d)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Device" : "Add Device"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Device Name</Form.Label>
              <Form.Control
                type="text"
                value={form.device_name}
                onChange={(e) =>
                  setForm({ ...form, device_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                value={form.serial_number}
                onChange={(e) =>
                  setForm({ ...form, serial_number: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
              </Form.Select>
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

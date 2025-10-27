import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";

export default function TransmittalTab() {
  const [trans, setTrans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    employee_name: "",
    device_list: "",
    date_issued: "",
    status: "",
    signature: "",
  });

  useEffect(() => {
    fetchTrans();
  }, []);

  const fetchTrans = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/transmittals");
      setTrans(res.data);
    } catch (err) {
      console.error("Error fetching transmittals:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (!form.employee_name || !form.device_list) {
        alert("Employee and device list are required.");
        return;
      }

      if (editing) {
        await axios.put(
          `http://localhost:4000/api/transmittals/${editing.id}`,
          form
        );
      } else {
        await axios.post("http://localhost:4000/api/transmittals", form);
      }

      setShowModal(false);
      setEditing(null);
      setForm({
        employee_name: "",
        device_list: "",
        date_issued: "",
        status: "",
        signature: "",
      });
      fetchTrans();
    } catch (err) {
      console.error("Error saving transmittal:", err);
      alert("Failed to save transmittal. Check console for details.");
    }
  };

  const handleEdit = (t) => {
    setEditing(t);
    setForm(t);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transmittal?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/transmittals/${id}`);
      fetchTrans();
    } catch (err) {
      console.error("Error deleting transmittal:", err);
    }
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Transmittals</h4>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setForm({
              employee_name: "",
              device_list: "",
              date_issued: "",
              status: "",
              signature: "",
            });
            setShowModal(true);
          }}
        >
          + Add Transmittal
        </Button>
      </div>

      <Table striped bordered hover>
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Employee</th>
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

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Transmittal" : "Add Transmittal"}</Modal.Title>
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
              <Form.Label>Devices</Form.Label>
              <Form.Control
                type="text"
                placeholder="List of device names or IDs"
                value={form.device_list}
                onChange={(e) =>
                  setForm({ ...form, device_list: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date Issued</Form.Label>
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
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Signature (text)</Form.Label>
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

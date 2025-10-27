import React, { useState, useEffect } from "react";
import api from "../api";
import { Modal, Button, Table, Form } from "react-bootstrap";

export default function EmployeesTab({ search }) {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    email: "",
    department: "",
    position: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.employee_id) return alert("Missing fields");
    try {
      if (editing) await api.put(`/employees/${editing.id}`, form);
      else await api.post("/employees", form);
      setShowModal(false);
      setEditing(null);
      setForm({ employee_id: "", name: "", email: "", department: "", position: "" });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (emp) => {
    setEditing(emp);
    setForm(emp);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <h4>Employees</h4>
        <Button onClick={() => { setEditing(null); setForm({ employee_id: "", name: "", email: "", department: "", position: "" }); setShowModal(true); }}>
          + Add Employee
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Emp ID</th><th>Name</th><th>Email</th><th>Dept</th><th>Position</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter((emp) =>
              Object.values(emp).join(" ").toLowerCase().includes(search.toLowerCase())
            )
            .map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(emp)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {["employee_id", "name", "email", "department", "position"].map((f) => (
            <Form.Group key={f} className="mb-2">
              <Form.Label>{f.replace("_", " ").toUpperCase()}</Form.Label>
              <Form.Control value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editing ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

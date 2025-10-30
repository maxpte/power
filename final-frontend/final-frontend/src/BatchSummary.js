import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BatchSummary = () => {
  const { batchesRef } = useParams();
  const [batch, setBatch] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
  const isOperator = userRoles.includes("OPERATOR");
 
  useEffect(() => {
    fetch(`http://localhost:8080/api/us4/batch/${batchesRef}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setBatch(data))
      .catch((err) => console.error("Error fetching batch:", err));
  }, [batchesRef]);

  if (!batch) return <p>Loading...</p>;

  const payments = Array.isArray(batch.payments) ? batch.payments : [];
  const totalDebitAmount = payments.reduce((sum, p) => sum + Number(p.salaryAmount || 0), 0);
  const maxDebitAmount = payments.reduce((max, p) => Math.max(max, Number(p.salaryAmount || 0)), 0);

  const startEdit = (tx) => {
    if (!isOperator) return;
    setEditingId(tx.id);
    setEditValues({
      employeeId: tx.employeeId ?? "",
      employeeName: tx.employeeName ?? "",
      employeeAccountNo: tx.employeeAccountNo ?? "",
      salaryAmount: tx.salaryAmount ?? 0,
      currency: tx.currency ?? (batch?.currency || "INR"),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (paymentId) => {
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:8080/api/batch/payment/${paymentId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setBatch(prev => ({
        ...prev,
        payments: prev.payments.map(p => p.id === paymentId ? updated : p)
      }));
      cancelEdit();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (paymentId) => {
    if (!isOperator) return;
    if (!window.confirm("Delete this transaction?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/batch/payment/${paymentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok && res.status !== 204) throw new Error("Delete failed");
      setBatch(prev => ({
        ...prev,
        payments: prev.payments.filter(p => p.id !== paymentId)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-primary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>
      <h5>Batch Summary - {batch.batchRefNo}</h5>

      <div className="bg-white p-3 border rounded shadow-sm">
        <p><strong>Created By:</strong> {batch.createdBy}</p>
        <p><strong>Status:</strong> {batch.status}</p>
        <p><strong>Currency:</strong> {batch.currency}</p>
        <p><strong>Total Debit Amount:</strong> {totalDebitAmount}</p>
        <p><strong>Max Debit Amount:</strong> {maxDebitAmount}</p>
      </div>

      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Account No</th>
              <th>Salary</th>
              {isOperator && <th className="text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(batch.payments) && batch.payments.length > 0 ? (
              batch.payments.map((tx) => (
                <tr key={tx.id}>
                  <td>{editingId === tx.id ? (
                    <input className="form-control" value={editValues.employeeId} onChange={e => setEditValues(v => ({...v, employeeId: e.target.value}))} />
                  ) : (
                    tx.employeeId
                  )}</td>
                  <td>{editingId === tx.id ? (
                    <input className="form-control" value={editValues.employeeName} onChange={e => setEditValues(v => ({...v, employeeName: e.target.value}))} />
                  ) : tx.employeeName}</td>
                  <td>{editingId === tx.id ? (
                    <input className="form-control" value={editValues.employeeAccountNo} onChange={e => setEditValues(v => ({...v, employeeAccountNo: e.target.value}))} />
                  ) : tx.employeeAccountNo}</td>
                  {/* Format the salary as a number */}
                  <td>{editingId === tx.id ? (
                    <input className="form-control" type="number" value={editValues.salaryAmount} onChange={e => setEditValues(v => ({...v, salaryAmount: Number(e.target.value)}))} />
                  ) : Number(tx.salaryAmount).toLocaleString()}</td>
                  {isOperator && (
                    <td className="text-center">
                      {editingId === tx.id ? (
                        <>
                          <button className="btn btn-sm btn-success me-2" disabled={saving} onClick={() => saveEdit(tx.id)}>
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(tx)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteRow(tx.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isOperator ? 5 : 4} className="text-center">No employees for this batch.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchSummary;

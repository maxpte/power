import React, { useEffect, useState, useRef, useMemo } from "react";
import { exportTableToCSV } from "./exportTableToCSV";
import { useParams, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";

const BatchSummary = () => {
  const { batchesRef } = useParams();
  const [batch, setBatch] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");
  const isOperator = userRoles.includes("OPERATOR");
  const isEditable =
    isOperator &&
    ["PENDING", "NOT_APPROVED"].includes((batch?.status || "").toUpperCase());

  const tableRef = useRef(null);

  const exportCSV = () => {
    exportTableToCSV(tableRef.current, "Batch_Summary.csv");
  };

  // Local search for payments table
  const [tableSearch, setTableSearch] = useState("");

  const payments = useMemo(() => (
    Array.isArray(batch?.payments) ? batch.payments : []
  ), [batch]);

  const filteredPayments = useMemo(() => {
    if (!tableSearch) return payments;
    const q = tableSearch.toLowerCase();
    return payments.filter((p) =>
      [
        p.employeeId,
        p.employeeName,
        p.employeeAccountNo,
        p.currency,
        String(p.salaryAmount),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [payments, tableSearch]);

  const totalDebitAmount = payments.reduce(
    (sum, p) => sum + Number(p.salaryAmount || 0),
    0
  );
  const maxDebitAmount = payments.reduce(
    (max, p) => Math.max(max, Number(p.salaryAmount || 0)),
    0
  );

  // Adapter to reuse SearchInput API (expects setFilters updating an object with search)
  const setSearchAdapter = (updater) => {
    setTableSearch((prev) => {
      const next = typeof updater === "function" ? updater({ search: prev }) : updater;
      return typeof next === "object" && next !== null && "search" in next ? next.search : prev;
    });
  };

  useEffect(() => {
 fetch(`http://localhost:8080/api/us4/batch/${batchesRef}`, { // 👈 Use backticks for URL
  method: 'GET', // 👈 Explicitly define the method (optional, but good practice)
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
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
  }, [batchesRef, token]);

  if (!batch) return <p>Loading...</p>;

  const startEdit = (tx) => {
    if (!isEditable) return;
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
      const res = await fetch(
    // ISSUE 1 FIXED: URL enclosed in backticks (`)
    `http://localhost:8080/api/us4/batch/${batchesRef}/payment/${paymentId}`,
    {
      method: "PUT",
      headers: {
        // ISSUE 2 FIXED: Header value enclosed in backticks (`)
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editValues),
    }
);
      if (res.status === 409) {
        alert(
          "Edits are allowed only when batch status is Pending or Not Approved."
        );
        return;
      }
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setBatch((prev) => ({
        ...prev,
        payments: prev.payments.map((p) => (p.id === paymentId ? updated : p)),
      }));
      cancelEdit();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (paymentId) => {
    if (!isEditable) return;
    try {
     const res = await fetch(
    // 👈 URL enclosed in backticks (`)
    `http://localhost:8080/api/us4/batch/${batchesRef}/payment/${paymentId}`, 
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
);
      if (res.status === 409) {
        //alert("Deletes are allowed only when batch status is Pending or Not Approved.");
        return;
      }
      if (!res.ok && res.status !== 204) throw new Error("Delete failed");
      setBatch((prev) => ({
        ...prev,
        payments: prev.payments.filter((p) => p.id !== paymentId),
      }));
      setSuccessMsg("Transaction deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      
      {successMsg && (
        <div className="alert alert-success py-2" role="alert">
          {successMsg}
        </div>
      )}
      <h5>Batch Summary - {batch.batchReference}</h5>

      <div className="bg-white p-3 border rounded shadow-sm">
        <p>
          <strong>Created By:</strong> {batch.createdBy}
        </p>
        <p>
          <strong>Status:</strong> {batch.status}
        </p>
        <p>
          <strong>Currency:</strong> {batch.currency}
        </p>
        <p>
          <strong>Total Debit Amount:</strong> {totalDebitAmount}
        </p>
        <p>
          <strong>Max Debit Amount:</strong> {maxDebitAmount}
        </p>
      </div>

       {/* <h5 className="fw-semibold text-primary m-0">Payments</h5> */}
   

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 m-4">
        <div className="d-flex align-items-center gap-2" style={{ minWidth: "320px", flex: 1 }}>
          <SearchInput search={tableSearch} setFilters={setSearchAdapter} />
        </div>
        <button className="btn btn-outline-primary" onClick={exportCSV}>
          Export List
        </button>
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-bordered" ref={tableRef}>
          <thead className="table-light">
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Account No</th>
              <th>Salary</th>
              {isEditable && <th className="text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredPayments) && filteredPayments.length > 0 ? (
              filteredPayments.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    {editingId === tx.id ? (
                      <input
                        className="form-control"
                        value={editValues.employeeId}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            employeeId: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      tx.employeeId
                    )}
                  </td>
                  <td>
                    {editingId === tx.id ? (
                      <input
                        className="form-control"
                        value={editValues.employeeName}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            employeeName: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      tx.employeeName
                    )}
                  </td>
                  <td>
                    {editingId === tx.id ? (
                      <input
                        className="form-control"
                        value={editValues.employeeAccountNo}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            employeeAccountNo: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      tx.employeeAccountNo
                    )}
                  </td>
                  {/* Format the salary as a number */}
                  <td>
                    {editingId === tx.id ? (
                      <input
                        className="form-control"
                        type="number"
                        value={editValues.salaryAmount}
                        onChange={(e) =>
                          setEditValues((v) => ({
                            ...v,
                            salaryAmount: Number(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      Number(tx.salaryAmount).toLocaleString()
                    )}
                  </td>
                  {isEditable && (
                    <td className="text-center">
                      {editingId === tx.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            disabled={saving}
                            onClick={() => saveEdit(tx.id)}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startEdit(tx)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteRow(tx.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isOperator ? 5 : 4} className="text-center">
                  No employees for this batch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchSummary;
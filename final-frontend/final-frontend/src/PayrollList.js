import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function PayrollList({
  batches,
  setBatches,
  processedBatches,
  setProcessedBatches,
  token,
}) { 
  const [selectedIds, setSelectedIds] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");

  const navigate = useNavigate();
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    const approvableIds = filteredBatches.filter((b) => !b.alreadyApproved).map((b) => b.id);
    if (e.target.checked) {
      setSelectedIds(approvableIds);
    } else {
      setSelectedIds([]);
    }
  };

  const openModal = (type) => {
    if (selectedIds.length === 0)
      return alert("Please select at least one batch.");
    setActionType(type);
    setShowModal(true);
  };

  const refreshAll = async () => {
    // Pending approvals
    const bRes = await fetch("http://localhost:8080/api/us5/approval/pending", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const pending = await bRes.json();
    // Map into UI shape expected by this table (same as initial load in ApproveHome)
    const mapped = Array.isArray(pending) ? pending.map(b => ({
      id: b.batchReference,
      user: b.createdBy,
      date: b.createdAt ? new Date(b.createdAt).toLocaleString() : "",
      debitAccount: b.debitedFromAccount,
      noofpayments: b.numberOfPayments,
      maxamount: `${b.maxDebitAmountCurrency} ${Number(b.maxDebitAmount || 0).toLocaleString()}`,
      totalamount: `${b.totalDebitAmountCurrency} ${Number(b.totalDebitAmount || 0).toLocaleString()}`,
      statusof: b.status,
      currency: b.maxDebitAmountCurrency,
      approverProgress: `${b.approvalsDone ?? 0}/${b.requiredApprovers ?? 1}`,
      alreadyApproved: !!b.alreadyApproved,
    })) : [];
    setBatches(mapped);

    // Processed batches (not strictly needed for this page, but keep state consistent)
    const pRes = await fetch("http://localhost:8080/api/us5/approval/processed", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const processed = await pRes.json();
    setProcessedBatches(Array.isArray(processed) ? processed : []);
  };

  const confirmAction = async () => {
  try {
    const endpoint = actionType === "approve"
      ? "http://localhost:8080/api/us5/approval/approve"
      : "http://localhost:8080/api/us5/approval/reject";
    const reqBody = {
      batchReferences: selectedIds,
      password: password,
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    if (!res.ok) throw new Error("Approval/rejection failed");

    setShowModal(false);
    setError("");
    setPassword("");
    setSelectedIds([]);
    await refreshAll();
  } catch (err) {
    setError("Incorrect password, expired token, or approval failed");
  }
};


  const filteredBatches = batches.filter(
    (b) =>
      (currencyFilter === "All" || b.currency === currencyFilter) &&
      ((b.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
       (b.user?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-primary fw-bold">Approve Payroll</h3>

      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Batch Reference or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-25"
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
        >
          <option value="All">All Currencies</option>
          <option value="USD">USD</option>
          <option value="SGD">SGD</option>
          <option value="INR">INR</option>
        </select>
      </div>

      <table className="table table-bordered table-hover text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  filteredBatches.filter((b) => !b.alreadyApproved).length > 0 &&
                  filteredBatches
                    .filter((b) => !b.alreadyApproved)
                    .every((b) => selectedIds.includes(b.id))
                }
                disabled={filteredBatches.filter((b) => !b.alreadyApproved).length === 0}
              />
            </th>
            <th>Batch Reference & Name</th>
            <th>Batch By & On</th>
            <th>Debited From Account</th>
            <th>Number of Payments</th>
            <th>Max Debit Amount</th>
            <th>Total Debit Amount</th>
            <th>Status</th>
            <th>Approvals</th>
          </tr>
        </thead>
        <tbody>
          {filteredBatches.map((b) => (
            <tr key={b.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(b.id)}
                  onChange={() => handleSelect(b.id)}
                  disabled={b.alreadyApproved}
                  title={b.alreadyApproved ? "You have already approved this batch" : ""}
                />
              </td>
              <td
                onClick={() => navigate(`/approvals/batch/${b.id}`, { state: b })}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {b.id}
              </td>
              <td>
                {b.user}
                <br />
                <small className="text-muted">{b.date}</small>
              </td>
              <td>{b.debitAccount}</td>
              <td>{b.noofpayments}</td>
              <td>{b.maxamount}</td>
              <td>{b.totalamount}</td>
              <td>{b.statusof}</td>
              <td>{b.approverProgress || "0/1"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <button className="btn btn-success me-2" onClick={() => openModal("approve")}>
          Approve
        </button>
        <button className="btn btn-danger me-2" onClick={() => openModal("reject")}>
          Reject
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/processed", { state: { processedBatches } })}
        >
          View Processed Batches
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter your password to proceed.</p>
          <input
            type="password"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAction}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PayrollList;

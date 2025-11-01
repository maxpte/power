import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function BatchDetails() {
  const { id } = useParams(); // This 'id' is the batchRefNo
  const [batch, setBatch] = useState(null);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("authToken");


  useEffect(() => {
    // 1. Fetch Batch Details
    fetch(`http://localhost:8080/api/us4/batch/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Batch Data:", data); // <-- Add this to see what you're getting
        setBatch(data);
      })
      .catch(() => setBatch(null));

    // 2. Fetch Payment Details
    fetch(`http://localhost:8080/api/us4/batch/${id}/payments`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Payments Data:", data); // <-- Add this to see what you're getting
        setPayments(data);
      })
      .catch(() => setPayments([]));
  }, [id, token]); // Re-run if 'id' or 'token' changes


  if (!batch) {
    return (
      <div className="container mt-4">
        <p>Loading details or batch not found.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/approvals/approve")}>
          Back
        </button>
      </div>
    );
  }


  // --- THIS IS THE FIXED PART ---
  // Use the correct property names from your API
  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(location.state?.from === "processed" ? "/processed" : "/approvals/approve") }>
        Back
      </button>
      <h4 className="mb-3 text-primary fw-bold">Batch Details</h4>

      <div className="card p-4 shadow-sm mb-3">
        {/* Use the property names from your API response */}
        <p><b>Batch Reference:</b> {batch.batchReference}</p>
        <p><b>Batched By & On:</b> {batch.createdBy} on {new Date(batch.createdAt).toLocaleString()}</p>
        
        {/*
          HERE IS THE FIX FOR THE "OBJECT" ERROR:
          Render a property *from* the debitAccount object.
          Use .name, .number, or whatever key your API sends.
        */}
        <p><b>Debit Account:</b> {batch.debitAccount ? batch.debitAccount.name : 'N/A'} ({batch.debitAccount ? batch.debitAccount.number : ''})</p>
        <p><b>Currency:</b> {batch.currency}</p>
        <p><b>Total Debit Amount:</b> {batch.currency} {Number(batch.totalDebitAmount).toLocaleString()}</p>
      </div>


      <h5 className="mb-3">Transactions</h5>
      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>Employee ID</th>
            <th>Beneficiary Name</th>
            <th>Account Number</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments && payments.length > 0 ? (
            payments.map((t) => (
              <tr key={t.id}>
                <td>{t.employeeId}</td>
                <td>{t.employeeName}</td>
                <td>{t.employeeAccountNo}</td>
                {/* Format the salary as a number */}
                <td>{Number(t.salaryAmount).toLocaleString('en-IN')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-muted">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


export default BatchDetails;
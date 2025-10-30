import React, { useEffect, useState } from "react";

const BatchGrid = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
      const token = localStorage.getItem("authToken");

    fetch("http://localhost:8080/api/us3/batch/grid",{
       headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch batches");
        return res.json();
      })
      .then((data) => {
        setBatches(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load batch data from backend.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="card shadow-sm my-4 p-4">
      <h4 className="fw-bold text-primary mb-3">All Payroll Batches</h4>
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Batch Reference</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>No. of Payments</th>
                <th>Max Debit Amount</th>
                <th>Total Debit Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.length ? (
                batches.map((batch, idx) => (
                  <tr key={idx}>
                    <td>{batch.batchReference}</td>
                    <td>{batch.createdBy}</td>
                    <td>{new Date(batch.createdAt).toLocaleString()}</td>
                    <td>{batch.numberOfPayments}</td>
                    <td>{batch.maxDebitAmount}</td>
                    <td>{batch.totalDebitAmount}</td>
                    <td>{batch.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No batch data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchGrid;
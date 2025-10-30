import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ProcessedBatches() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [allProcessed, setAllProcessed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true);
      try {
        // ✅ CORRECT ENDPOINT - matches Swagger documentation
        const res = await fetch("http://localhost:8080/api/us5/approval/processed", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        // Backend already filters for APPROVED/REJECTED
        setAllProcessed(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching processed batches:", error);
        setAllProcessed([]);
      }
      setLoading(false);
    };
    fetchBatches();
  }, [token]);

  // Filter helpers - use correct status values from backend
  const filterStatusMap = {
    "All": () => true,
    "Approved": (b) => b.status === "APPROVED",
    "Rejected": (b) => b.status === "REJECTED"
  };
  
  const filtered = allProcessed.filter(
    (b) =>
      filterStatusMap[filter](b) &&
      (
        (b.batchReference?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (b.createdBy?.toLowerCase() || "").includes(search.toLowerCase())
      )
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-primary fw-bold">Processed Batches</h3>

      {/* Filter + Search */}
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select w-25"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Batch Reference or Created By"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No processed batches found.</p>
      ) : (
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Batch Reference & Name</th>
              <th>Batch By & On</th>
              <th>Debited From Account</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.batchId}>
                <td
                  onClick={() => navigate(`/approvals/batch/${b.batchReference}`, { state: { ...b, from: "processed" } })}
                  style={{ cursor: "pointer", color: "blue" }}
                  title="View batch details"
                >
                  {b.batchReference}
                </td>
                <td>
                  {b.createdBy}
                  <br />
                  <small className="text-muted">
                    {new Date(b.createdAt).toLocaleString()}
                  </small>
                </td>
                <td>{b.debitedFromAccount}</td>
                <td>{b.totalDebitAmountCurrency}</td>
                <td
                  className={
                    b.status === "APPROVED"
                      ? "text-success fw-semibold"
                      : "text-danger fw-semibold"
                  }
                >
                  {b.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/approvals/approve")}>
        Back
      </button>
    </div>
  );
}

export default ProcessedBatches;
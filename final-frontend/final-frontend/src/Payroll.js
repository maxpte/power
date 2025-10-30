import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Controls from "./Searchbar";
import axios from "axios";

const Payroll = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    sort: "none",
  });
  
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editValues, setEditValues] = useState({});

  // 1. === FIX: CORRECT AUTH AND ROLE CHECKING ===
  const token = localStorage.getItem("authToken");
  // Get the JSON array string from localStorage
  const userRolesString = localStorage.getItem("userRoles") || "[]";
  // Parse it into a real array
  const userRoles = JSON.parse(userRolesString);
  // Check if "OPERATOR" is in the array
  const isOperator = userRoles.includes("OPERATOR");
  // === END FIX ===

  // 2. === FIX: ADDED AUTH TOKEN TO API CALLS ===
  // Create an axios instance that automatically includes the token
  const api = axios.create({
    baseURL: "http://localhost:8080/api/us4/batch", // User Story 4: Batch Summary
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  // Fetch batch data from backend
  useEffect(() => {
    api.get("/grid") // Uses the base URL: /api/batch/grid
      .then((res) => {
        // 4. === FIX: MAPPED BACKEND DATA TO FRONTEND STATE ===
        // This prevents errors if API fields don't match table fields
        const mapped = res.data.map(b => ({
          batchRefNo: b.batchReference,
          createdBy: b.createdBy,
          dateTime: b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A",
          noOfPayments: b.numberOfPayments,
          maxDebitAmount: b.maxDebitAmount,
          totalDebitAmount: b.totalDebitAmount,
          debitAccountNo: b.debitAccountNumber || "N/A", // Use field from your backend
          status: b.status,
          currency: b.currency || "N/A"
        }));
        setTableData(mapped);
      })
      .catch((err) => {
        console.error("Error fetching batches:", err);
      });
  }, []); // Empty array means this runs once on load

  // DELETE Batch
  const handleDel = async (idx) => {
    const batch = tableData[idx];
    try {
      await api.delete(`/${batch.batchRefNo}`); // Uses api instance with auth
      const newData = tableData.filter((_, i) => i !== idx);
      setTableData(newData);
      setOpenMenu(null);
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  // Edit & Save
  const handleEditClick = (i) => {
    setEditIndex(i);
    setEditValues(tableData[i]);
    setOpenMenu(null);
  };

  const handleSave = async () => {
    try {
      const updatedBatch = { ...editValues };
      // Backend expects the original API format, not the mapped one
      // You may need to "un-map" your data before sending it
      await api.put(`/${updatedBatch.batchRefNo}`, updatedBatch); // Uses api instance with auth
      
      const newData = [...tableData];
      newData[editIndex] = updatedBatch;
      setTableData(newData);
      setEditIndex(null);
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  const handleCancel = () => setEditIndex(null);

  // Filter & Sort
  const filteredData = useMemo(() => {
    // ... (Your filter logic is good) ...
    let res = tableData.filter(
      (item) =>
        (filters.status === "All" || item.status === filters.status) &&
        Object.values(item)
          .join("")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
    );

    if (filters.sort === "asc") {
      res.sort((a, b) => a.batchRefNo.localeCompare(b.batchRefNo));
    } else if (filters.sort === "desc") {
      res.sort((a, b) => b.batchRefNo.localeCompare(a.batchRefNo));
    } else if (filters.sort === "alpha") {
      res.sort((a, b) => a.createdBy.localeCompare(b.createdBy));
    }
    return res;
  }, [filters, tableData]);

  return (
    <>
      <Controls filters={filters} setFilters={setFilters} />
      <div className="container-fluid mt-3 px-4 w-100">
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light text-center">
              <tr>
                <th>Batch Reference No</th>
                <th>Batch by & On</th>
                <th>No. of Payments</th>
                <th>Max Debit Amount</th>
                <th>Total Debit Amount</th>
                <th>Debit Account No</th>
                <th>Batch Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((batch, i) => (
                // Use a unique key
                <tr key={batch.batchRefNo}> 
                  {editIndex === i ? (
                    <>
                      {/* ... (Your inline edit cells) ... */}
                      <td>{batch.batchRefNo}</td>
                      <td className="text-center">
                        <input
                          type="text"
                          value={editValues.createdBy}
                          className="form-control mb-1 text-center"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              createdBy: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          value={editValues.dateTime}
                          className="form-control text-center"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              dateTime: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          value={editValues.noOfPayments}
                          className="form-control text-center"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              noOfPayments: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editValues.maxDebitAmount}
                          className="form-control"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              maxDebitAmount: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editValues.totalDebitAmount}
                          className="form-control"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              totalDebitAmount: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editValues.debitAccountNo || ""}
                          className="form-control"
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              debitAccountNo: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>{batch.status}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* ... (Your view-mode cells) ... */}
                      <td
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        // 5. === FIX: NAVIGATION ROUTE ===
                        // This should match your App.js route, e.g., /batch/:batchRefNo
                        onClick={() => navigate(`/approvals/batches/${batch.batchRefNo}`)} 
                      >
                        {batch.batchRefNo}
                      </td>
                      <td className="text-center">
                        {batch.createdBy} <br />
                        {batch.dateTime}
                      </td>
                      <td className="text-center">{batch.noOfPayments}</td>
                      {/* Format amounts for display */}
                      <td>{batch.currency} {Number(batch.maxDebitAmount).toLocaleString()}</td>
                      <td>{batch.currency} {Number(batch.totalDebitAmount).toLocaleString()}</td>
                      <td>{batch.debitAccountNo}</td>
                      <td>{batch.status}</td>
                      <td className="text-center position-relative">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setOpenMenu(openMenu === i ? null : i)}
                        >
                          {/* ... (3-dot icon) ... */}
                           <svg
                             xmlns="http://www.w3.org/2000/svg"
                             width="16"
                             height="16"
                             fill="currentColor"
                             className="bi bi-three-dots-vertical"
                             viewBox="0 0 16 16"
                           >
                             <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                           </svg>
                        </button>

                        {openMenu === i && (
                          <div
                            className="position-absolute bg-white border rounded p-2"
                            style={{ /* ... (your styles) ... */ zIndex: 10, right: 0, minWidth: '150px' }}
                          >
                            <button
                              className="btn btn-sm btn-outline-primary w-100 mb-1"
                              onClick={() =>
                                // 5. === FIX: NAVIGATION ROUTE ===
                                navigate(`/approvals/batches/${batch.batchRefNo}`)
                              }
                            >
                              View Summary
                            </button>
                            
                            {/* 6. === FIX: CORRECT ROLE LOGIC === */}
                            {isOperator && (batch.status === "PENDING" || batch.status === "DRAFT" || batch.status === "REJECTED") && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-danger w-100"
                                  onClick={() => handleDel(i)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                            
                            {/* You can add Approver buttons here too */}
                            {/* {isApprover && batch.status === "PENDING" && ( ... )} */}

                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Payroll;

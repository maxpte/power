import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'; // <-- IMPORTED

import PayrollFilters from "./PayrollFilters";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

function PayrollManual() {
  const [filters, setFilters] = useState({
    debitAccount: "",
    date: new Date(),
    payrollType: "Domestic",
    paymentCurrency: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    salary: "",
    currency: "",
    accountNumber: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [batchGrid, setBatchGrid] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all accounts for dropdown
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8080/api/accounts", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then(setAccounts)
      .catch(() => setAccounts([]));
  }, []);

  // Fetch details of the selected account
  useEffect(() => {
    if (!filters.debitAccount) {
      setAccountDetails(null);
      return;
    }
    const token = localStorage.getItem("authToken");
    fetch(`http://localhost:8080/api/accounts/${filters.debitAccount}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    })
      .then(res => res.json())
      .then(setAccountDetails)
      .catch(() => setAccountDetails(null));
  }, [filters.debitAccount]);

  // Load batch grid
  useEffect(() => {
    fetchBatchGrid();
  }, []);

  // Auto-update employee currency when payroll type or payment currency changes
  useEffect(() => {
    if (filters.payrollType === "Domestic") {
      setNewEmployee((prev) => ({ ...prev, currency: "INR" }));
    } else if (filters.payrollType === "Foreign" && filters.paymentCurrency) {
      setNewEmployee((prev) => ({ ...prev, currency: filters.paymentCurrency }));
    }
  }, [filters.payrollType, filters.paymentCurrency]);

  const fetchBatchGrid = () => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8080/api/us3/batch/grid", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch batches");
        return res.json();
      })
      .then((data) => setBatchGrid(data))
      .catch(() => {
        setError("Failed to load batch data from backend.");
        setLoading(false);
      });
  };

  const areFiltersValid = Object.values(filters).every(Boolean);

  const handleFiltersChange = (updated) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  // Validation and employee management logic here (unchanged)
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const { payrollType, paymentCurrency } = filters;
    if (!newEmployee.id || !newEmployee.name || !newEmployee.salary || !newEmployee.accountNumber) {
      setError("All fields are required.");
      return;
    }
    if (employees.some((emp) => emp.id === newEmployee.id)) {
      setError("An employee with this ID already exists.");
      return;
    }

    if (
      filters.payrollType === "Domestic" &&
      newEmployee.currency?.trim().toUpperCase() !== "INR"
    ) {
      setError("For Domestic payroll, employee currency must be INR.");
      return;
    } else if (
      filters.payrollType === "Foreign" &&
      newEmployee.currency?.trim().toUpperCase() !==
      filters.paymentCurrency?.trim().toUpperCase()
    ) {
      setError(
        `For Foreign payroll and currency ${filters.paymentCurrency}, employee currency must be ${filters.paymentCurrency}.`
      );
      return;
    } else {
      setError(null);
    }

    setEmployees([...employees, newEmployee]);
    setNewEmployee({
      id: "",
      name: "",
      salary: "",
      currency: payrollType === "Domestic" ? "INR" : paymentCurrency,
      accountNumber: "",
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["id", "salary", "accountNumber"].includes(name)) {
      if (/^\d*$/.test(value)) setNewEmployee((prev) => ({ ...prev, [name]: value }));
    } else if (name === "name") {
      if (/^[a-zA-Z\s]*$/.test(value)) setNewEmployee((prev) => ({ ...prev, [name]: value }));
    } else if (name === "currency") {
      if (filters.payrollType === "Domestic" && value !== "INR") return;
      if (filters.payrollType === "Foreign" && value !== filters.paymentCurrency) return;
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveEmployee = (idx) =>
    setEmployees(employees.filter((_, i) => i !== idx));

  const totalAmount = employees.reduce((acc, emp) => acc + Number(emp.salary || 0), 0);

  const selectedCurrency = (accountDetails?.currency || filters.paymentCurrency || "INR").toUpperCase();
  const INR_PER = { INR: 1, USD: 83, EUR: 90 };
  const INR_THRESHOLD_1 = 1000000;
  const INR_THRESHOLD_2 = 2500000;
  const t1 = INR_THRESHOLD_1 / (INR_PER[selectedCurrency] || 1);
  const t2 = INR_THRESHOLD_2 / (INR_PER[selectedCurrency] || 1);

  let approverCount = 1;
  if (totalAmount > t1 && totalAmount < t2) approverCount = 2;
  else if (totalAmount >= t2) approverCount = 3;

  const currencySymbol = CURRENCY_SYMBOLS[selectedCurrency];
  const availableBalance =
    accountDetails
      ? Number(accountDetails.balance).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "N/A";

  // Recent batches and total debited from backend grid
  const filteredBatches = batchGrid
    .filter((b) => b.currency === selectedCurrency)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentBatches = filteredBatches.slice(0, 3);

  const handleSubmitForApproval = () => {
    setSubmitting(true);
    const token = localStorage.getItem('authToken');
    const batchData = {
      batchReference: "BATCH" + Date.now(),
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      debitAccount: { id: filters.debitAccount },
      maxDebitAmount: Math.max(...employees.map(emp => Number(emp.salary) || 0)),
      totalDebitAmount: totalAmount,
      status: "PENDING",
      payments: employees.map((emp) => ({
        employeeId: emp.id,
        employeeName: emp.name,
        salaryAmount: Number(emp.salary),
        currency: emp.currency,
        employeeAccountNo: emp.accountNumber,
        status: "PENDING",
      })),
      currency: selectedCurrency,
    };

    fetch("http://localhost:8080/api/us3/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(batchData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save batch!");
        return res.json();
      })
      .then(() => {
        toast.success("Batch submitted successfully!"); // <-- UPDATED
        setEmployees([]);
        fetchBatchGrid();
      })
      .catch(() => {
        toast.error("Error saving batch. Please try again."); // <-- UPDATED
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      {/* --- ADDED Toaster COMPONENT --- */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="container my-4">
        <div className="p-4 bg-white shadow-sm rounded-3">
          <header className="pb-3 mb-4 border-bottom">
            <h2 className="text-primary fw-bold">Payroll Initiation</h2>
            <p className="text-muted">Create payment batches by entering employee details manually.</p>
          </header>

          {/* Dashboard Top Row */}
          <div className="row mb-3" style={{ minHeight: 285 }}>
            <div className="col-md-5 col-lg-4 d-flex align-items-stretch" style={{ paddingLeft: 0 }}>
              <div className="card p-4 shadow-sm h-100 border-primary" style={{ borderRadius: "18px" }}>
                <div className="fw-bold mb-2">Batch will debit from:</div>
                {!accountDetails ? (
                  <span className="text-muted">Select an account.</span>
                ) : (
                  <>
                    <h5 className="mb-2 text-primary">{accountDetails.name}</h5>
                    <div><b>Bank:</b> {accountDetails.bank}</div>
                    <div>
                      <b>Account Number:</b> {accountDetails.number}
                    </div>
                    <div className="text-muted mt-2">{accountDetails.description}</div>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-7 col-lg-8 d-flex flex-column gap-3">
              <div className="w-100 ms-md-3">
                <div className="card bg-light mb-3 border border-primary shadow-sm" style={{ borderRadius: "18px" }}>
                  <div className="card-body py-3">
                    <div className="fw-bold text-secondary mb-1">Available Balance</div>
                    <div className="fs-4 text-success">{currencySymbol}{availableBalance}</div>
                    <div className="text-muted">{recentBatches.length ? new Date(recentBatches[0].createdAt).toLocaleString() : "N/A"}</div>
                  </div>
                </div>
                <div className="card bg-white border border-primary shadow-sm" style={{ borderRadius: "18px" }}>
                  <div className="card-body py-3">
                    <div className="fw-bold text-secondary mb-2">Recent Batches</div>
                    <ul className="list-unstyled mb-0">
                      {recentBatches.length === 0 ? (
                        <li>No history.</li>
                      ) : (
                        recentBatches.map((item, idx) => (
                          <li key={idx}>
                            <span className="fw-semibold">{new Date(item.createdAt).toLocaleDateString()}:</span> {currencySymbol}{Number(item.totalDebitAmount).toLocaleString()} debited ({item.numberOfPayments} payments)
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-3 text-end">
          <Link className="btn btn-outline-primary btn-sm" to="/payments/file-upload">
            Switch to File Upload
          </Link>
        </div>

        {/* SINGLE FILTERS ROW */}
        <PayrollFilters
          filters={filters}
          onChange={handleFiltersChange}
          accounts={accounts}
        />

        {/* Input Form */}
        <div className="my-4 p-4 border rounded-3 bg-light shadow-sm">
          <h5 className="mb-3 fw-semibold">Add Employee Manually</h5>
          {error && <div className="alert alert-danger p-2">{error}</div>}
          <form onSubmit={handleAddEmployee} className="row g-3 align-items-end">
            <div className="col-sm-6 col-md-2">
              <label className="form-label fw-semibold">Employee ID</label>
              <input
                type="text"
                name="id"
                value={newEmployee.id}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 col-md-3">
              <label className="form-label fw-semibold">Employee Name</label>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 col-md-2">
              <label className="form-label fw-semibold">Salary</label>
              <input
                type="text"
                name="salary"
                value={newEmployee.salary}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 col-md-2">
              <label className="form-label fw-semibold">Currency</label>
              <select
                name="currency"
                value={newEmployee.currency}
                onChange={handleInputChange}
                className="form-select"
                disabled={filters.payrollType === "Domestic" || filters.payrollType === "Foreign"}
              >
                {filters.payrollType === "Domestic" && <option>INR</option>}
                {filters.payrollType === "Foreign" && filters.paymentCurrency !== "" && (
                  <option>{filters.paymentCurrency}</option>
                )}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={newEmployee.accountNumber}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={!areFiltersValid}>
                Add Employee
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4">
          <div className="table-responsive rounded-3 overflow-hidden shadow-sm">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Salary Amount</th>
                  <th>Currency</th>
                  <th>Account Number</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((e, idx) => (
                    <tr key={idx}>
                      <td>{e.id}</td>
                      <td>{e.name}</td>
                      <td>{parseFloat(e.salary || 0).toFixed(2)}</td>
                      <td>{e.currency}</td>
                      <td>{e.accountNumber}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveEmployee(idx)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No employee data. Please add employees.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end gap-4 fw-bold mt-3 p-3 bg-light rounded-3">
            <span>Total Employees: {employees.length}</span>
            <span>
              Total Debit Amount: {currencySymbol}
              {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`badge bg-${approverCount === 1 ? "primary" : approverCount === 2 ? "warning" : "danger"}`}
            >
              Requires {approverCount} Approver{approverCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="mt-4 d-flex flex-wrap justify-content-center gap-3 border-top pt-4">
          <button
            className="btn btn-success"
            onClick={handleSubmitForApproval}
            disabled={employees.length === 0 || submitting}
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </div>

    </>
  );
}

export default PayrollManual;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast'; // <-- 1. IMPORT
import PayrollFilters from "./PayrollFilters";
import PayrollTable from "./PayrollTable";
import UploadFile from "./UploadFile";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€" };

const PayrollPayments = () => {
  const [filters, setFilters] = useState({
    debitAccount: "",
    date: new Date(),
    payrollType: "",
    paymentCurrency: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [batchGrid, setBatchGrid] = useState([]);

  // Fetch all accounts for dropdown
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8080/api/accounts", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
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
      },
    })
      .then(res => res.json())
      .then(setAccountDetails)
      .catch(() => setAccountDetails(null));
  }, [filters.debitAccount]);

  // Enforce payroll type and payment currency based on selected account currency
  useEffect(() => {
    if (!accountDetails) return;
    const accCur = (accountDetails.currency || "").toUpperCase();
    if (accCur === "INR") {
      setFilters(prev => ({ ...prev, payrollType: "Domestic", paymentCurrency: "INR" }));
    } else if (accCur === "USD" || accCur === "EUR") {
      setFilters(prev => ({ ...prev, payrollType: "Foreign", paymentCurrency: accCur }));
    }
    // Reset employees when account currency context changes to avoid mismatches
    setEmployees([]);
    setError("");
  }, [accountDetails]);

  useEffect(() => {
    fetchBatchGrid();
  }, []);

  const fetchBatchGrid = () => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8080/api/us3/batch/grid", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch batches!");
        return res.json();
      })
      .then(setBatchGrid)
      .catch(() => {
        setError("Failed to load batch data from backend.");
        setBatchGrid([]);
      });
  };

  const areFiltersValid = Object.values(filters).every(Boolean);

  const handleFiltersChange = (updated) => {
    let next = { ...filters, ...updated };

    if (updated.debitAccount) {
      const acc = accounts.find(a => String(a.id) === String(updated.debitAccount));
      const accCur = (acc?.currency || "").toUpperCase();
      if (accCur === "INR") {
        next.payrollType = "Domestic";
        next.paymentCurrency = "INR";
      } else if (accCur) {
        next.payrollType = "Foreign";
        next.paymentCurrency = accCur;
      }
    } else {
      // Coerce any manual toggles back to the account currency rule if account known
      const accCur = (accountDetails?.currency || "").toUpperCase();
      if (accCur) {
        if (accCur === "INR") {
          next.payrollType = "Domestic";
          next.paymentCurrency = "INR";
        } else {
          next.payrollType = "Foreign";
          next.paymentCurrency = accCur;
        }
      }
    }

    setFilters(next);
    setEmployees([]);
    setError("");
  };

  const handleFileData = (rows) => {
    if (!rows.length || !rows[0].id) {
      setError("Invalid file format.");
      return;
    }
    let invalidRows = [];
    if (filters.payrollType === "Domestic") {
      invalidRows = rows.filter(
        (row) =>
          row.payrollType.trim().toLowerCase() !== "domestic" ||
          row.currency.trim().toUpperCase() !== "INR"
      );
    } else if (filters.payrollType === "Foreign") {
      const expectedCurrency = filters.paymentCurrency.toUpperCase();
      invalidRows = rows.filter(
        (row) =>
          row.payrollType.trim().toLowerCase() !== "foreign" ||
          row.currency.trim().toUpperCase() !== expectedCurrency
      );
    }
    if (invalidRows.length > 0) {
      if (filters.payrollType === "Domestic") {
        setError("Rows must match Payroll Type (Domestic) and Currency (INR).");
      } else if (filters.payrollType === "Foreign") {
        setError(
          `Rows must match Payroll Type (Foreign) and Currency (${filters.paymentCurrency}).`
        );
      } else {
        setError("Rows do not match the selected Payroll Type or Currency.");
      }
      setEmployees([]);
      return;
    }
    setEmployees(rows);
    setError("");
  };

  const totalAmount = employees.reduce(
    (acc, emp) => acc + Number(emp.salary || 0),
    0
  );

  const selectedCurrency = (accountDetails?.currency || filters.paymentCurrency || "").toUpperCase();
  const INR_PER = { INR: 1, USD: 83, EUR: 90 };
  const INR_THRESHOLD_1 = 1000000;
  const INR_THRESHOLD_2 = 2500000;
  const t1 = selectedCurrency ? (INR_THRESHOLD_1 / (INR_PER[selectedCurrency] || 1)) : 0;
  const t2 = selectedCurrency ? (INR_THRESHOLD_2 / (INR_PER[selectedCurrency] || 1)) : 0;

  let approverCount = 1;
  if (totalAmount > t1 && totalAmount <= t2) approverCount = 2;
  else if (totalAmount > t2) approverCount = 3;

  // Use backend balance from accountDetails
  const currencySymbol = CURRENCY_SYMBOLS[accountDetails?.currency || filters.paymentCurrency || ""];
  const availableBalance =
    accountDetails
      ? Number(accountDetails.balance).toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )
      : "N/A";

  const filteredBatches = selectedCurrency
    ? batchGrid
        .filter((b) => b.currency === selectedCurrency)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];
  const recentBatches = filteredBatches.slice(0, 3);

  const handleSubmitForApproval = () => {
    setSubmitting(true);
    const token = localStorage.getItem("authToken");
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
      currency: accountDetails?.currency || filters.paymentCurrency || "INR",
    };
    fetch("http://localhost:8080/api/us3/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(batchData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save batch!");
        return res.json();
      })
      .then(() => {
        // --- 3. REPLACE ALERT ---
        toast.success("Batch submitted successfully!"); // <-- REPLACED
        setEmployees([]);
        fetchBatchGrid();
      })
      .catch(() => {
        // --- 3. REPLACE ALERT ---
        toast.error("Error saving batch. Please try again."); // <-- REPLACED
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <>
      {/* --- 2. ADD Toaster COMPONENT --- */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="container my-4 bg-white shadow-sm p-4 rounded-3">
        <header className="pb-3 mb-4 border-bottom">
          <h2 className="text-primary fw-bold">Payroll Initiation</h2>
          <p className="text-muted">
            Create payment batches by uploading employee details excel file.
          </p>
        </header>

        {/* Dashboard Top Row - show only after account is selected */}
        {accountDetails && (
          <div className="row mb-3" style={{ minHeight: 285 }}>
            <div className="col-md-5 col-lg-4 d-flex align-items-stretch mt-4" style={{ paddingLeft: 0 }}>
              <div className="card p-4 shadow-sm h-100 border-primary " style={{ borderRadius: "18px" }}>
                <div className="fw-bold mb-2">Batch will debit from:</div>
                <>
                  <h5 className="mb-2 text-primary">{accountDetails.name}</h5>
                  <div><b>Bank:</b> {accountDetails.bank}</div>
                  <div>
                    <b>Account Number:</b> XXXX-{accountDetails.number?.slice(-9) || ""}
                  </div>
                  <div className="text-muted mt-2">{accountDetails.description}</div>
                </>
              </div>
            </div>
            <div className="col-md-7 col-lg-8 d-flex flex-column gap-3">
              <div className="w-100 ms-md-3">
                <div className="card bg-light mb-3 border border-primary shadow-sm"
                  style={{ borderRadius: "18px" }}>
                  <div className="card-body py-3">
                    <div className="fw-bold text-secondary mb-1">
                      Available Balance
                    </div>
                    <div className="fs-4 text-success">
                      {currencySymbol}{availableBalance}
                    </div>
                    <div className="text-muted">
                      {recentBatches.length
                        ? new Date(recentBatches[0].createdAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="card bg-white border border-primary shadow-sm" style={{ borderRadius: "18px" }}>
                  <div className="card-body py-3">
                    <div className="fw-bold text-secondary mb-2">
                      Recent Batches
                    </div>
                    <ul className="list-unstyled mb-0">
                      {recentBatches.length === 0 ? (
                        <li>No history.</li>
                      ) : (
                        recentBatches.map((item, idx) => (
                          <li key={idx}>
                            <span className="fw-semibold">
                              {new Date(item.createdAt).toLocaleDateString()}:
                            </span>{" "}
                            {currencySymbol}
                            {Number(item.totalDebitAmount).toLocaleString()} debited ({item.numberOfPayments} payments)
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prompt above filters when no account selected */}
        {!filters.debitAccount && (
          <div className="alert alert-info py-2">Please select a debit account to begin your payroll.</div>
        )}

        <div className="mb-3 text-end">
          <Link className="btn btn-outline-primary btn-sm" to="/payments/manual">
            Switch to Manual Entry
          </Link>
        </div>

        {/* SINGLE FILTERS ROW: Use only the dynamic PayrollFilters, not a second filters row */}
        <PayrollFilters
          filters={filters}
          onChange={handleFiltersChange}
          accounts={accounts}
        />

        {!areFiltersValid && (
          <div className="alert alert-warning mb-3">
            Please fill all filter fields before uploading Excel file.
          </div>
        )}

        {areFiltersValid && <UploadFile onData={handleFileData} />}
        {error && <div className="alert alert-danger">{error}</div>}
        <PayrollTable employees={employees} setEmployees={setEmployees} />
        {employees.length > 0 && (
          <div className="d-flex justify-content-end gap-4 fw-bold mt-3 p-3 bg-light rounded-3">
            <span>
              Total Debit Amount: {currencySymbol}
              {Number(totalAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={`badge bg-${approverCount === 1
                  ? "primary"
                  : approverCount === 2
                    ? "warning"
                    : "danger"
                }`}
            >
              Requires {approverCount} Approver
              {approverCount > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="mt-4 d-flex flex-wrap justify-content-center gap-3 border-top pt-3">
          <button
            className="btn btn-success"
            disabled={!areFiltersValid || employees.length === 0 || submitting}
            onClick={handleSubmitForApproval}
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PayrollPayments;
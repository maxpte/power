import React from "react";
import DatePicker from "react-datepicker";


const PayrollFilters = ({ filters, onChange, accounts = [] }) => (
  <div className="row g-3 my-3 p-3 border rounded-3 bg-light align-items-end">
    <div className="col-md-3">
      <label className="form-label fw-semibold">Debit Account</label>
      <select
        className="form-select"
        value={filters.debitAccount}
        onChange={e => onChange({ debitAccount: e.target.value })}
      >
        <option value="">Select Account</option>
        {accounts.map(a => (
          <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
        ))}
      </select>
    </div>
    <div className="col-md-3">
      <label className="form-label fw-semibold">Date</label>
      <DatePicker
  selected={filters.date}
  onChange={(date) => onChange({ date })}
  dateFormat="yyyy-MM-dd"
  className="form-control"
/>
    </div>
    <div className="col-md-3">
      <label className="form-label fw-semibold">Payroll Type</label>
      <div className="btn-group w-100">
        <button
          className={`btn btn-sm ${filters.payrollType === "Domestic" ? "btn-primary" : "btn-outline-secondary"}`}
          type="button"
          onClick={() => onChange({ payrollType: "Domestic" })}
        >
          Domestic
        </button>
        <button
          className={`btn btn-sm ${filters.payrollType === "Foreign" ? "btn-primary" : "btn-outline-secondary"}`}
          type="button"
          onClick={() => onChange({ payrollType: "Foreign" })}
        >
          Foreign
        </button>
      </div>
    </div>
    <div className="col-md-3">
      <label className="form-label fw-semibold">Payment Currency</label>
      <select
        className="form-select"
        value={filters.paymentCurrency}
        onChange={e => onChange({ paymentCurrency: e.target.value })}
      >
        <option value="">Select</option>
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
      </select>
    </div>
  </div>
);

export default PayrollFilters;

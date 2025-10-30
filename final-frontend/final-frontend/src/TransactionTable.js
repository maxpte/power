import React from "react";

const TransactionTable = ({
  transactions,
  selectedAccount,
  accountCurrency,
  openingBalance,
  closingBalance,
  accountNumber
}) => {
  // Helper for safe number formatting (dash if value is "-", null or not a finite number)
  const safeFormat = (val) => {
    if (val === "-" || val === undefined || val === null || isNaN(Number(val))) return "-";
    return Number(val).toLocaleString();
  };

  return (
    <div>
      {selectedAccount && (
        <div className="mb-3">
          <div className="alert alert-info d-flex justify-content-between">
            <div>
              <strong>ACCOUNT : </strong>
              {accountNumber || selectedAccount}
            </div>
            <span>
              <strong>Opening Balance:</strong> {safeFormat(openingBalance)} {accountCurrency}
            </span>
            <span>
              <strong>Closing Balance:</strong> {safeFormat(closingBalance)} {accountCurrency}
            </span>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table text-center align-middle">
          <thead className="table-secondary">
            <tr>
              <th>DATE</th>
              <th>DESCRIPTION</th>
              <th>REFERENCE</th>
              <th>MODE</th>
              <th>DEBIT ({accountCurrency})</th>
              <th>CREDIT ({accountCurrency})</th>
              <th>BALANCE ({accountCurrency})</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((t, index) => (
                <tr key={index}>
                  <td>{t.date || "-"}</td>
                  <td>{t.description || "-"}</td>
                  <td>{t.reference || "-"}</td>
                  <td>{t.mode || "-"}</td>
                  <td>{safeFormat(t.debit)}</td>
                  <td>{safeFormat(t.credit)}</td>
                  <td>{safeFormat(t.balance)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No statement data for this account.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;

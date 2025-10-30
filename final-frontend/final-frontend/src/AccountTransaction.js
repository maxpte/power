import React, { useState, useEffect } from "react";
import AccountTable from "./AccountTable";
import TransactionTable from "./TransactionTable";

const exchangeRates = { USD: 1, EUR: 0.93, INR: 83.2 };

const AccountTransaction = () => {
  const [accountsData, setAccountsData] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statement, setStatement] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch("http://localhost:8080/api/accounts", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(setAccountsData)
      .catch(() => setAccountsData([]));
  }, []);

  // Fetch the ledger/statement object when an account is selected
  useEffect(() => {
    if (!selectedAccount) {
      setStatement(null);
      return;
    }
    const token = localStorage.getItem("authToken");
    // Assumes .number is the unique account number used by the endpoint
    const accObj =
      accountsData.find(a => a.id === selectedAccount) ||
      accountsData.find(a => a.number === selectedAccount);

    if (!accObj || !accObj.number) {
      setStatement(null);
      return;
    }

    // --- THIS IS THE FIX ---

  // 1. Build the base URL
  const baseUrl = `http://localhost:8080/api/account-statement/${accObj.number}/statement`;

  // 2. Create URL parameters
  const params = new URLSearchParams();
  if (fromDate) {
    params.append("fromDate", fromDate);
  }
  if (toDate) {
    params.append("toDate", toDate);
  }

  // 3. Combine them into the final URL
  const finalUrl = `${baseUrl}?${params.toString()}`;

  // 4. Use the final URL in the fetch
  fetch(finalUrl, { // <-- Use the new URL
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(setStatement)
    .catch(() => setStatement(null));

// 5. Add fromDate and toDate to the dependency array
}, [selectedAccount, accountsData, fromDate, toDate]);

  const totalBalance = accountsData.reduce((sum, acc) => {
    const baseToSelected = exchangeRates[currency] / exchangeRates[acc.currency];
    return sum + acc.balance * baseToSelected;
  }, 0);

  const downloadStatement = () => {
    if (!statement || !statement.transactions) return;

    let csvContent = "data:text/csv;charset=utf-8,Date,Description,Reference,Mode,Debit,Credit,Balance\n";
    statement.transactions.forEach(t => {
      csvContent += `${t.date},${t.description},${t.reference},${t.mode},${t.debit},${t.credit},${t.balance}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      encodedUri
    );
    link.setAttribute(
      "download",
      `statement_${statement.accountNumber}_${fromDate || "all"}_${toDate || "all"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-4 p-3 border rounded bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h4 className="fw-bold text-primary mb-2 mb-md-0">ACCOUNTS</h4>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="text-center">
            <small className="text-muted d-block">Total Balance</small>
            <h5 className="mb-0 text-success">
              {totalBalance.toFixed(2)} {currency}
            </h5>
          </div>
          <div className="d-flex align-items-center">
            <label className="me-2 fw-semibold">Currency:</label>
            <select
              className="form-select"
              style={{ width: "180px" }}
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>
      </div>

      <AccountTable
        accounts={accountsData}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        currency={currency}
      />

      {selectedAccount && statement && (
        <>
          <div className="mt-4 mb-3">
            <h5 className="fw-bold text-primary">TRANSACTION</h5>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <div>
                  <label className="me-2 fw-semibold">FROM:</label>
                  <input
                    type="date"
                    className="form-control d-inline-block"
                    style={{ width: "180px" }}
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="me-2 fw-semibold">TO:</label>
                  <input
                    type="date"
                    className="form-control d-inline-block"
                    style={{ width: "180px" }}
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-primary" onClick={downloadStatement}>
                DOWNLOAD STATEMENT
              </button>
            </div>
          </div>
          <TransactionTable
            transactions={statement.transactions}
            selectedAccount={statement.accountNumber}
            accountNumber={statement.accountNumber}
            accountCurrency={statement.selectedCurrency}
            openingBalance={statement.openingBalance}
            closingBalance={statement.closingBalance}
          />
        </>
      )}
    </div>
  );
};

export default AccountTransaction;

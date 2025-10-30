import React from "react";

const exchangeRates = {
  USD: 1,
  EUR: 0.93,
  INR: 83.2,
};

const AccountTable = ({ accounts, selectedAccount, setSelectedAccount, currency }) => {
  const convertedAccounts = accounts.map((acc) => {
    const baseToSelected = exchangeRates[currency] / exchangeRates[acc.currency];
    return {
      ...acc,
      displayBalance: (acc.balance * baseToSelected).toFixed(2) + " " + currency
    };
  });

  return (
    <div className="table-responsive">
      <table className="table table-hover text-center align-middle ">
        <thead className="table-secondary">
          <tr>
            <th>ACCOUNT</th>
            <th>CURRENCY</th>
            <th>ACCOUNT NAME</th>
            <th>BALANCE</th>
            <th>SELECTED CURRENCY BALANCE</th>
            <th>LAST UPDATED</th>
          </tr>
        </thead>
        <tbody>
          {convertedAccounts.length > 0 ? (
            convertedAccounts.map((acc, index) => (
              <tr 
                key={acc.id}
                onClick={() => setSelectedAccount(acc.id)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedAccount === acc.id ? '#d1ecf1' : 'transparent'
                }}
              >
                <td>{acc.number}</td>
                <td>{acc.currency}</td>
                <td>{acc.name}</td>
                <td>{acc.balance} {acc.currency}</td>
                <td>{acc.displayBalance}</td>
                <td>{acc.lastUpdated}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No Accounts Found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AccountTable;
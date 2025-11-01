import React, { useState, useEffect } from "react";
import PayrollList from "./PayrollList";

function ApproveHome() {
  const [batches, setBatches] = useState([]);
  const [processedBatches, setProcessedBatches] = useState([]);
  const token = localStorage.getItem("authToken"); 
  // Fetch batches for approval (mapped into UI shape)
  useEffect(() => {
    fetch("http://localhost:8080/api/us5/approval/pending", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    })
      .then(res => res.json())
      .then(list => setBatches(
        list.map(b => ({
          id: b.batchReference,
          user: b.createdBy,
          date: new Date(b.createdAt).toLocaleString(),
          debitAccount: b.debitedFromAccount,
          noofpayments: b.numberOfPayments,
          maxamount: `${b.maxDebitAmountCurrency} ${Number(b.maxDebitAmount).toLocaleString()}`,
          totalamount: `${b.totalDebitAmountCurrency} ${Number(b.totalDebitAmount).toLocaleString()}`,
          statusof: b.status,
          currency: b.maxDebitAmountCurrency,
          approverProgress: `${b.approvalsDone ?? 0}/${b.requiredApprovers ?? 1}`,
          alreadyApproved: !!b.alreadyApproved,
        }))
      ))
      .catch(() => setBatches([]));
  }, [token]);


  return (
    <div>
      <PayrollList
        batches={batches}
        setBatches={setBatches}
        processedBatches={processedBatches}
        setProcessedBatches={setProcessedBatches}
        token={token}
      />
    </div>
  );
}

export default ApproveHome;

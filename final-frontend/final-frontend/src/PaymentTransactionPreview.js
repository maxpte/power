import React, { useState, useEffect } from 'react';
import BatchList from './TransactionList';
import BatchPreview from './TransactionPreview';
import TransactionPrintArea from './TransactionPrintArea';

export default function PaymentTransactionPreview() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [batches, setBatches] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});

  // List of batch summaries
  useEffect(() => {
    fetch('http://localhost:8080/api/us6/print/batches', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(setBatches)
      .catch(() => setBatches([]));
  }, []);

  // Fetch full batch details on select/preview
  useEffect(() => {
    selectedIds.forEach(batchReference => {
      if (!detailsMap[batchReference]) {
        fetch(`http://localhost:8080/api/us6/print/batch/${batchReference}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => setDetailsMap(prev => ({ ...prev, [batchReference]: data })));
      }
    });
  }, [selectedIds, detailsMap]);

  const printableBatches = selectedIds.map(id => detailsMap[id]).filter(Boolean);

  function toggleSelect(batchReference) {
    setSelectedIds(prev =>
      prev.includes(batchReference)
        ? prev.filter(x => x !== batchReference)
        : [...prev, batchReference]
    );
  }

  function handlePrint() {
    if (!selectedIds.length) {
      alert('Select at least one batch to print.');
      return;
    }
    window.print();
  }

  return (
    <div className="container my-4">
      <h2 className="mb-3">Transaction Print Preview</h2>
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Transactions</h5>
            <div>
              <button className="btn btn-sm btn-success" onClick={handlePrint}>Print Selected</button>
            </div>
          </div>
          <BatchList
            batches={batches}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            onPreview={id => setSelectedIds([id])}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h6>Screen Mockup</h6>
          <div className="border p-2" style={{ height: 300, overflow: 'auto' }}>
            {printableBatches.length === 0 ? (
              <div className="text-muted">No batches selected.</div>
            ) : (
              printableBatches.map((b, i) => (
                <BatchPreview key={b.batchReference || i} batch={b} />
              ))
            )}
          </div>
        </div>
      </div>
      <TransactionPrintArea batches={printableBatches} />
    </div>
  );
}

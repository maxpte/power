import React from 'react';

export default function TransactionList({ batches, selectedIds, toggleSelect, onPreview }) {
  return (
    <div>
      {(batches || []).map((b) => (
        <div key={b.batchReference} className="form-check d-flex align-items-center border rounded p-2 mb-2">
          <input
            className="form-check-input me-2"
            type="checkbox"
            checked={selectedIds.includes(b.batchReference)}
            onChange={() => toggleSelect(b.batchReference)}
            id={`chk-${b.batchReference}`}
          />
          <label className="form-check-label flex-grow-1" htmlFor={`chk-${b.batchReference}`}>
            <strong>{b.batchReference}</strong> — {b.currency} {b.totalDebitAmount} <span className="text-muted">({b.status})</span>
          </label>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onPreview(b.batchReference)}
          >
            Preview
          </button>
        </div>
      ))}
    </div>
  );
}

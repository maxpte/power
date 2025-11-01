import React from 'react';
import BatchPreview from './TransactionPreview';

export default function TransactionPrintArea({ batches }) {
  if (!Array.isArray(batches) || !batches.length) {
    return <div className="text-muted">No batches selected for printing.</div>;
  }
  return (
    <div id="printable-area">
      {(batches || []).map((b) => (
        <div key={b.batchReference} className="mb-4">
          <BatchPreview batch={b} />
        </div>
      ))}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

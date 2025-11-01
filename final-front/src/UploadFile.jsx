import React from "react";
import * as XLSX from "xlsx";

const UploadFile = ({ onData }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      onData(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-3">
      <input type="file" accept=".xlsx,.xls" className="form-control" onChange={handleFile} />
    </div>
  );
};

export default UploadFile;

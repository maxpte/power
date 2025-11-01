const PayrollTable = ({ employees, setEmployees }) => {
  const handleRemove = (idx) => {
    setEmployees(employees.filter((_, i) => i !== idx));
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle rounded-3 overflow-hidden">
        <thead className="table-light">
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Salary Amount</th>
            <th>Currency</th>
            <th>Account Number</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length
            ? employees.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{parseFloat(e.salary || 0).toFixed(2)}</td>
                  <td>{e.currency}</td>
                  <td>{e.accountNumber}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(idx)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  No data
                </td>
              </tr>
            )}
        </tbody>
      </table>
      <div className="fw-bold mt-3 p-3 bg-light rounded-3 d-flex justify-content-end gap-4">
        <span>Total Employees: {employees.length}</span>
        <span>Total Debit Amount: {employees.reduce((a, e) => a + Number(e.salary || 0), 0).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PayrollTable;
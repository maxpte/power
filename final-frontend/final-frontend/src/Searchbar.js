import React, { useState } from "react";
import SearchInput from "./SearchInput"; // ✅ imported new reusable search component
import { exportTableToCSV } from "./exportTableToCSV";

const SearchBar = ({ filters, setFilters }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Export table data to CSV
  const exportCSV = () => {
    const table = document.querySelector("table");
    exportTableToCSV(table, "Payroll_List.csv");
  };

  return (
    <div className="container-fluid bg-light py-3 px-4 shadow-sm">
      {/* 🔹 Header Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold text-primary m-0">MANAGE PAYROLL</h5>
        <button className="btn btn-outline-primary" onClick={exportCSV}>
          Export List
        </button>
      </div>

      {/* 🔹 Search + Filter + Sort + Settings */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <SearchInput search={filters.search} setFilters={setFilters} />
        {/* ✅ Reusable Search Input */}

        {/* Filter + Sort + Settings Buttons */}
        <div className="d-flex align-items-center gap-2 position-relative">
          {/* Filter Dropdown */}
          <div className="position-relative">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowFilter(!showFilter);
                setShowSort(false);
              }}
            >
              Filter
            </button>
            {showFilter && (
              <div
                className="position-absolute bg-white border rounded p-2"
                style={{ top: "110%", right: 0, minWidth: "180px", zIndex: 10 }}
              >
                <select
                  className="form-select form-select-sm"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="All">All Statuses</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="position-relative">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowSort(!showSort);
                setShowFilter(false);
              }}
            >
              Sort
            </button>
            {showSort && (
              <div
                className="position-absolute bg-white border rounded p-2"
                style={{ top: "110%", right: 0, minWidth: "150px", zIndex: 10 }}
              >
                <select
                  className="form-select form-select-sm"
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters({ ...filters, sort: e.target.value })
                  }
                >
                  <option value="none">No Sort</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                  <option value="alpha">Alphabetical</option>
                </select>
              </div>
            )}
          </div>

          {/* Reset / Settings Button */}
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              setFilters({ search: "", status: "All", sort: "none" })
            }
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
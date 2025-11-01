import React from "react";

const SearchInput = ({ search, setFilters }) => {
  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search in List"
      value={search}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, search: e.target.value }))
      }
      style={{ maxWidth: "350px", flexGrow: 1 }}
    />
  );
};

export default SearchInput;
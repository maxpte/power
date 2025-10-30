// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  profileDropdownOpen,
  setProfileDropdownOpen,
  handleLogout,
}) => (
  <nav className="navbar navbar-expand-lg navbar-light navbar-custom fixed-top">
    <div className="container-fluid px-4">
      <div className="d-flex align-items-center">
        <button
          className="hamburger-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>
        <Link className="navbar-brand navbar-brand-custom" to="/">
         
          <span>Standard Chartered</span>
        </Link>
      </div>

      <div className="ms-auto d-flex align-items-center">
        <button
          className="profile-btn"
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          aria-label="Profile menu"
        >
          <i className="bi bi-person-circle"></i>
        </button>

        {profileDropdownOpen && (
          <div className="profile-dropdown">
            <button className="profile-dropdown-item" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  </nav>
);

export default Navbar;

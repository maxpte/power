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
        <Link className="navbar-brand fw-bold text-success" to="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR45uCMOZoXBmTzG6X-ZvKd2T0tILB2m2TPWQ&s"
            alt="Standard Chartered"
            height="30"
            className="d-inline-block align-top me-2"
          />
          Standard Chartered Bank
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

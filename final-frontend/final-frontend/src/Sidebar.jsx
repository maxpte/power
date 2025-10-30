// Sidebar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // Import the CSS file

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const location = useLocation();

  const togglePayments = () => setPaymentsOpen(!paymentsOpen);
  const toggleApprovals = () => setApprovalsOpen(!approvalsOpen);
  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => toggleSidebar();
  const handlePaymentLinkClick = () => {
    setPaymentsOpen(false);
    toggleSidebar();
  };
  const handleApprovalLinkClick = () => {
    setApprovalsOpen(false);
    toggleSidebar();
  };

  return (
    <nav 
      className="sidebar-custom" 
      aria-label="Sidebar navigation"
      style={{ left: isOpen ? '0' : '-250px' }} // Keep dynamic style inline
    >
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {/* Home */}
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive("/homepage") ? "active" : ""}`}
              to="/homepage"
              onClick={handleLinkClick}
            >
              <i className="bi bi-house-door me-2"></i>
              Home
            </Link>
          </li>

          {/* Payments */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link d-flex justify-content-between align-items-center w-100"
              onClick={togglePayments}
              aria-expanded={paymentsOpen}
              aria-controls="payments-submenu"
            >
              <span className="d-flex align-items-center">
                <i className="bi bi-credit-card me-2"></i>
                Payments
              </span>
              <i className={`bi ${paymentsOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </button>

            {paymentsOpen && (
              <ul className="nav flex-column" id="payments-submenu">
                <li className="nav-item">
                  <Link
                    className={`nav-link submenu-item ${isActive("/payments/manual") ? "active" : ""}`}
                    to="/payments/manual"
                    onClick={handlePaymentLinkClick}
                  >
                    Manual
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link submenu-item ${isActive("/payments/file-upload") ? "active" : ""}`}
                    to="/payments/file-upload"
                    onClick={handlePaymentLinkClick}
                  >
                    File Upload
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Approvals */}
          <li className="nav-item">
            <button
              type="button"
              className="nav-link d-flex justify-content-between align-items-center w-100"
              onClick={toggleApprovals}
              aria-expanded={approvalsOpen}
              aria-controls="approvals-submenu"
            >
              <span className="d-flex align-items-center">
                <i className="bi bi-check-circle me-2"></i>
                Approvals
              </span>
              <i className={`bi ${approvalsOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            </button>

            {approvalsOpen && (
              <ul className="nav flex-column" id="approvals-submenu">
                <li className="nav-item">
                  <Link
                    className={`nav-link submenu-item ${isActive("/approvals/manage") ? "active" : ""}`}
                    to="/approvals/manage"
                    onClick={handleApprovalLinkClick}
                  >
                    Manage
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link submenu-item ${isActive("/approvals/approve") ? "active" : ""}`}
                    to="/approvals/approve"
                    onClick={handleApprovalLinkClick}
                  >
                    Approve
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Reports */}
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive("/reports") ? "active" : ""}`}
              to="/reports"
              onClick={handleLinkClick}
            >
              <i className="bi bi-file-earmark-text me-2"></i>
              Reports
            </Link>
          </li>

          {/* Statements */}
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive("/statements") ? "active" : ""}`}
              to="/statements"
              onClick={handleLinkClick}
            >
              <i className="bi bi-receipt me-2"></i>
              Statement
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;

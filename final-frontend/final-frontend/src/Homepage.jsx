// HomePage.js
import  { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {useNavigate}from"react-router-dom";

// Mock user data for dashboard
function Dashboard() {
  // 3. ADD STATE for data, loading, and errors
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. ADD useEffect to FETCH DATA on component load
  useEffect(() => {
    const token = localStorage.getItem('authToken');

    fetch("http://localhost:8080/api/dashboard", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data. Check permissions (403) or network.');
      }
      return response.json();
    })
    .then(data => {
      setDashboardData(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []); // The empty [] means this runs once on mount

  const getStatusBadgeClass = (status) => {
    switch (status) {
      // Assuming API status strings match your mock data
      case "Pending Approval": return "bg-warning text-dark";
      case "Approved": return "bg-success";
      case "Rejected": return "bg-danger";
      case "Processed": return "bg-info";
      default: return "bg-secondary";
    }
  };

  // 5. ADD Loading and Error handling
  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  // 6. RENDER THE DATA (if we have it)
  return (
    <>
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: '#333' }}>
          Welcome Back
        </h3>
      </div>
      {/* Statistics Cards - 7. UPDATE JSX to use dashboardData */}
      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 border-start border-warning border-4">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Pending Approval</h6>
                  {/* Changed from currentUser.stats.pendingApproval */}
                  <h2 className="mb-0 fw-bold text-warning">{dashboardData.pendingApprovalCount}</h2>
                </div>
                <i className="bi bi-clock-history text-warning" style={{ fontSize: "2.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 border-start border-danger border-4">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Rejected Batches</h6>
                  {/* Changed from currentUser.stats.rejectedBatches */}
                  <h2 className="mb-0 fw-bold text-danger">{dashboardData.rejectedCount}</h2>
                </div>
                <i className="bi bi-x-circle text-danger" style={{ fontSize: "2.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0 border-start border-success border-4">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Processed Batches</h6>
                  {/* Changed from currentUser.stats.processedBatches */}
                  <h2 className="mb-0 fw-bold text-success">{dashboardData.processedCount}</h2>
                </div>
                <i className="bi bi-check-circle text-success" style={{ fontSize: "2.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Batches Table */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3 p-md-4">
              <h5 className="card-title mb-4">
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Recent Batches
              </h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Batch ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 8. UPDATE MAP to use dashboardData.recentBatches */}
                    {dashboardData.recentBatches.map((batch) => (
                      // Use batchId from your API
                      <tr key={batch.batchId}>
                        {/* Use batchId from your API */}
                        <td className="fw-semibold">{batch.batchId}</td>
                        {/* NOTE: Your API spec didn't list 'name', but your screenshot has it.
                          I'm assuming the API *does* send 'name'.
                        */}
                        {/* Format the amount from the API */}
                        <td className="fw-semibold">
{batch.amount}                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(batch.status)}`}>
                            {batch.status}
                          </span>
                        </td>
                        {/* Format the date from the API */}
                        <td className="text-muted small">
                          {new Date(batch.date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer (Your existing footer code) ... */}
      {/* Footer - Only on Home Page */}
      <footer style={{
        background: 'linear-gradient(135deg, #00539f 0%, #003d75 100%)',
        color: 'white',
        padding: '50px 0 20px',
        marginTop: '60px',
        marginLeft: 'calc(-100vw / 2 + 50%)',
        marginRight: 'calc(-100vw / 2 + 50%)',
        marginBottom: '0',
        width: '100vw'
      }}>
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.85)' }}>
Delivering trusted financial services that connect people, ideas, and opportunities worldwide.              </p>
            </div>
            
            <div className="col-md-4 mb-4 mb-md-0">
              <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '20px', fontSize: '1.1rem' }}>Customer Service</h6>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '12px' }}>Contact Us</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '12px' }}>FAQ</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '12px' }}>Privacy Policy</p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '0' }}>Terms & Conditions</p>
            </div>
            
            <div className="col-md-4">
              <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '20px', fontSize: '1.1rem' }}>Contact Info</h6>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '16px' }}>
                <i className="bi bi-telephone me-2"></i>
                1800 102 7722
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '16px' }}>
                <i className="bi bi-envelope me-2"></i>
                service@sc.com
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.95rem', marginBottom: '0' }}>
                <i className="bi bi-clock me-2"></i>
                Mon-Sat: 9:30 AM - 6:00 PM
              </p>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '40px',
            paddingTop: '20px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            © 2025 Standard Chartered Bank. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default function HomePage({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

   const navigate=useNavigate();
  const handleLogout = () => {
    setProfileDropdownOpen(false);
    // Clear all user data from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('username');
    navigate('/');
    // Add logout logic if needed
  };

  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        profileDropdownOpen={profileDropdownOpen}
        setProfileDropdownOpen={setProfileDropdownOpen}
        handleLogout={handleLogout}
      />
      <div style={{ display: 'flex', marginTop: '56px' }}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content-shifted" style={{ flex: 1, background: '#f8f9fa' }}>
          <div className="px-4 px-md-5 py-4">
            {/* Show dashboard by default, fallback to children if passed */}
            {children || <Dashboard />}
          </div>
        </main>
      </div>
    </>
  );
}

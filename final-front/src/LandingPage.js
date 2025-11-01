import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold text-success" href="/">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR45uCMOZoXBmTzG6X-ZvKd2T0tILB2m2TPWQ&s" 
              alt="Standard Chartered" 
              height="40" 
              className="d-inline-block align-top me-2"
            />
            Standard Chartered Bank
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-success ms-3 px-4" onClick={handleLoginClick}>
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Streamline Your <span className="text-success">Payroll</span> Operations
              </h1>
              <p className="lead text-muted mb-4">
                Experience seamless payroll management with automated batch processing, 
                multi-currency support, and enterprise-grade approval workflows.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-success btn-lg px-5" onClick={handleGetStartedClick}>
                  Get Started
                </button>
                <a href="#features" className="btn btn-outline-success btn-lg px-5">
                  Learn More
                </a>
              </div>
              <div className="mt-5">
                <div className="d-flex align-items-center gap-4">
                  <div>
                    <h3 className="fw-bold text-success mb-0">10K+</h3>
                    <p className="text-muted small mb-0">Transactions Processed</p>
                  </div>
                  <div className="vr" style={{ height: '50px' }}></div>
                  <div>
                    <h3 className="fw-bold text-success mb-0">99.9%</h3>
                    <p className="text-muted small mb-0">Accuracy Rate</p>
                  </div>
                  <div className="vr" style={{ height: '50px' }}></div>
                  <div>
                    <h3 className="fw-bold text-success mb-0">24/7</h3>
                    <p className="text-muted small mb-0">Support Available</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://media.istockphoto.com/id/808678324/photo/moscow-city-skyscrapers.jpg?s=612x612&w=0&k=20&c=pwU0ikQwlKh_AYYqFmbOQEua8b1re4eSAmElkMERP2Q=" 
                alt="Payroll Dashboard" 
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Powerful Features</h2>
            <p className="lead text-muted">Everything you need to manage payroll efficiently</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fa-solid fa-layer-group"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Batch Processing</h4>
                  <p className="text-muted">
                    Process multiple employee payments in a single batch with manual entry or Excel file upload.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fa-solid fa-coins"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Multi-Currency Support</h4>
                  <p className="text-muted">
                    Support for domestic (INR) and foreign currency payments (USD, EUR) with real-time exchange rates.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fa-solid fa-user-check"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Approval Workflow</h4>
                  <p className="text-muted">
                    Multi-level approval system based on payment amount with role-based access control.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Real-Time Tracking</h4>
                  <p className="text-muted">
                    Monitor batch status, payment history, and account balance in real-time with detailed dashboards.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Reports & Analytics</h4>
                  <p className="text-muted">
                    Comprehensive reporting with payment statements, audit trails, and export capabilities.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-4">
                  <div className="feature-icon mb-3">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Secure & Compliant</h4>
                  <p className="text-muted">
                    Bank-grade security with role-based access, audit logs, and compliance with financial regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800" 
                alt="Team collaboration" 
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6 ps-lg-5">
              <h2 className="display-5 fw-bold mb-4">Built for Enterprise Payroll</h2>
              <p className="text-muted mb-4">
                Our payroll management system is designed specifically for enterprise organizations 
                requiring robust batch processing, multi-currency support, and complex approval workflows.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-success me-2" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  <strong>Automated Processing:</strong> Reduce manual errors with automated batch creation and validation
                </li>
                <li className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-success me-2" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  <strong>Scalable Architecture:</strong> Process thousands of payments efficiently with Spring Boot backend
                </li>
                <li className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill text-success me-2" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  <strong>Comprehensive Audit Trail:</strong> Track every action with detailed logs for compliance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-success text-white py-5">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Streamline Your Payroll?</h2>
          <p className="lead mb-4">Join leading organizations using our platform for efficient payroll management</p>
          <button className="btn btn-light btn-lg px-5" onClick={handleGetStartedClick}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3">Payroll Management</h5>
              <p className="text-muted">
                Enterprise-grade payroll processing with multi-currency support and advanced approval workflows.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#features" className="text-muted text-decoration-none">Features</a></li>
                <li className="mb-2"><a href="#about" className="text-muted text-decoration-none">About</a></li>
                <li className="mb-2"><a href="#" className="text-muted text-decoration-none" onClick={(e) => { e.preventDefault(); handleLoginClick(); }}>Login</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold mb-3">Contact Us</h5>
              <p className="text-muted mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                </svg>
                support@payroll.com
              </p>
              <p className="text-muted mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone me-2" viewBox="0 0 16 16">
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/>
                </svg>
                +91 1800-XXX-XXXX
              </p>
            </div>
          </div>
          <hr className="border-secondary my-4" />
          <div className="text-center text-muted">
            <p className="mb-0">© 2025 Standard Chartered Payroll Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
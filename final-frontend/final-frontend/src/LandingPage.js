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
            Payroll Management
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
                  <div className="icon-box bg-success bg-opacity-10 rounded p-3 mb-3 d-inline-block">
                    <img 
                      src="/images/queue.png" 
                      alt="Batch Processing" 
                      className="img-fluid rounded"
                    />
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
                  <div className="icon-box bg-success bg-opacity-10 rounded p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-currency-exchange text-success" viewBox="0 0 16 16">
                      <path d="M0 5a5 5 0 0 0 4.027 4.905 6.5 6.5 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05q-.001-.07.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.5 3.5 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5m16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0m-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674z"/>
                    </svg>
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
                  <div className="icon-box bg-success bg-opacity-10 rounded p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-shield-check text-success" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    </svg>
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
                  <div className="icon-box bg-success bg-opacity-10 rounded p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-clock-history text-success" viewBox="0 0 16 16">
                      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                      <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
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
                  <div className="icon-box bg-success bg-opacity-10 rounded p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-earmark-bar-graph text-success" viewBox="0 0 16 16">
                      <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z"/>
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                    </svg>
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
                  <div className="icon-box bg-success bg-opacity-10 rounded p-3 mb-3 d-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-lock text-success" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                    </svg>
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
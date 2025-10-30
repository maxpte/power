import React from "react";
// 1. Use "as Router" to match your team's convention
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Homepage from "./Homepage";
import PayrollPayments from "./PayrollPayments";
import PayrollManual from "./PayrollManual";
import BatchGrid from "./BatchGrid";
import ApproveHome from "./ApproveHome";
import BatchDetails from "./BatchDetails";
import ProcessedBatches from "./ProcessedBatches";
import Payroll from "./Payroll";
import BatchSummary from "./BatchSummary";
import AccountTransaction from "./AccountTransaction";
import PaymentTransactionPreview from "./PaymentTransactionPreview";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";



// 2. UPDATED PrivateRoute to use 'children' (the new pattern)
function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("authToken");
  const userRoles = JSON.parse(localStorage.getItem("userRoles") || "[]");

  if (!token) {
    // User is not logged in, redirect to the login page (which is now '/')
    return <Navigate to="/" replace />;
  }

  // 3. UPDATED Role Check
  // If 'roles' are provided, check them.
  // If not (like for the dashboard), let the logged-in user pass.
  if (roles && !roles.some(role => userRoles.includes(role))) {
    // User is logged in, but doesn't have the specific role
    // Send them to the main dashboard
    return <Navigate to="/homepage" replace />; 
  }

  // User is logged in and has permission, render the content
  return children;
}


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />


        {/* 4. UPDATED Login Route: path is now "/" */}
        {/* onLoginSuccess now redirects to "/homepage" */}
  {/* Updated Login Route with LoginForm */}


        {/* 5. UPDATED Homepage/Dashboard Route */}
        {/* Path is "/homepage", wrapped in PrivateRoute (no roles) */}
        <Route
          path="/homepage"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />

        {/* 6. UPDATED All other routes */}
        {/* Now wrapped in BOTH PrivateRoute and the <Homepage> layout */}
        <Route
          path="/payments/file-upload"
          element={
            <PrivateRoute roles={["OPERATOR"]}>
              <Homepage>
                <PayrollPayments />
              </Homepage>
            </PrivateRoute>
          }
        />

        <Route
          path="/payments/manual"
          element={
            <PrivateRoute roles={["OPERATOR"]}>
              <Homepage>
                <PayrollManual />
              </Homepage>
            </PrivateRoute>
          }
        />

        <Route
          path="/batch-grid"
          element={
            <PrivateRoute roles={["APPROVER"]}>
              <Homepage>
                <BatchGrid />
              </Homepage>
            </PrivateRoute>
          }
          />
            <Route
          path="/approvals/manage"
          element={
            <PrivateRoute roles={["APPROVER","OPERATOR"]}>
              <Homepage>
                <Payroll />
              </Homepage>
            </PrivateRoute>
          }
          />
            <Route
          path="/approvals/approve"
          element={
            <PrivateRoute roles={["APPROVER"]}>
              <Homepage>
                <ApproveHome  />
              </Homepage>
            </PrivateRoute>
          }
        />
         <Route
          path="/processed"
          element={
            <PrivateRoute roles={["APPROVER"]}>
              <Homepage>
                <ProcessedBatches />
              </Homepage>
            </PrivateRoute>
          }
        />
        <Route
  path="/approvals/batches/:batchesRef"
  element={
    <PrivateRoute roles={["APPROVER","OPERATOR"]}>
      <Homepage>
        <BatchSummary />
      </Homepage>
    </PrivateRoute>
  }
/>
        <Route
  path="/approvals/batch/:id"
  element={
    <PrivateRoute roles={["APPROVER","OPERATOR"]}>
      <Homepage>
        <BatchDetails />
      </Homepage>
    </PrivateRoute>
  }
/>
<Route
  path="/approvals/processed"
  element={
    <PrivateRoute roles={["APPROVER"]}>
      <Homepage>
        <ProcessedBatches />
      </Homepage>
    </PrivateRoute>
  }
/>
<Route
  path="/reports"
  element={
    <PrivateRoute roles={["APPROVER","OPERATOR"]}>
      <Homepage>
        <AccountTransaction />
      </Homepage>
    </PrivateRoute>
  }
/>

    <Route
  path="/statements"
  element={
    <PrivateRoute roles={["OPERATOR", "APPROVER"]}>
      <Homepage>
        <PaymentTransactionPreview />
      </Homepage>
    </PrivateRoute>
  }
/>    
        {/* 7. ADDED a catch-all redirect for safety */}
        <Route path="*" element={<Navigate to="/homepage" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
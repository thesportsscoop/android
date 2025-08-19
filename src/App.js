import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Program from "./pages/Program";
import ProgramTrack from "./pages/ProgramTrack";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";
import "./AppSpinner.css";


import Admin from "./pages/Admin";
import Subscription from "./pages/Subscription";
import JoinWaitlist from "./pages/JoinWaitlist";
import JoinWaitlistSuccess from "./pages/JoinWaitlistSuccess";

const PrivateRoute = ({ children, requireVerifiedEmail = true, adminOnly = false }) => {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireVerifiedEmail && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { currentUser, subscriptionPlan, isAdmin, logout } = useAuth();
  
  return (
    <>
      <Header user={currentUser} plan={subscriptionPlan} isAdmin={isAdmin} onLogout={logout} />
      <main>
        <Routes>
          <Route path="/join-waitlist/success" element={<JoinWaitlistSuccess />} />
          <Route path="/" element={<Home />} />
          <Route path="/program" element={
            <PrivateRoute>
              <Program />
            </PrivateRoute>
          } />
          <Route path="/program/:track" element={
            <PrivateRoute>
              <ProgramTrack />
            </PrivateRoute>
          } />
          <Route path="/join-waitlist" element={<JoinWaitlist />} />
          <Route path="/admin" element={
            <PrivateRoute adminOnly={true}>
              <Admin />
            </PrivateRoute>
          } />
          <Route path="/subscription" element={
            <PrivateRoute>
              <Subscription />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <ScrollToTop />
          <AppContent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

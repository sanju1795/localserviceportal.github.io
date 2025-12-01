import React, { useContext } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProviderCreate from "./pages/ProviderCreate";
import Dashboard from "./pages/Dashboard";
import ViewProfile from "./pages/ViewProfile";
import EditProfile from "./pages/EditProfile";
import UserSearch from "./pages/User";
import AboutUs from "./pages/AboutUs";  

import { AuthContext } from "./AuthContext";

export default function App() {
  const { isAuthenticated, logout, username, role } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="app">

      {/* PROFESSIONAL NAV */}
      <nav className="nav pro-nav">
        <Link className="nav-logo" to="/">
          <span className="logo-dot" /> LocalServicePortal
        </Link>
        

        <div className="nav-links">
          {!isAuthenticated && <Link to="/signup">Sign Up</Link>}
          {!isAuthenticated && <Link to="/login">Login</Link>}
          <Link to="/about" className="about-link">About</Link>

          {isAuthenticated && role === "User" && location.pathname !== "/" && (
            <Link to="/search">Search</Link>
          )}

          {isAuthenticated && role === "Provider" && <Link to="/profile">My Profile</Link>}
          {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}

          {isAuthenticated && (
            <button className="link-btn logout-btn" onClick={logout}>
              Logout ({username})
            </button>
          )}
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/provider/create" element={isAuthenticated ? <ProviderCreate /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ViewProfile /> : <Navigate to="/login" />} />
          <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <UserSearch /> : <Navigate to="/login" />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

/* 🌟 PROFESSIONAL HOME PAGE */
function Home() {
  return (
    <div className="home-hero">

      {/* Left Content */}
      <div className="hero-content">
        <h1>Hire Trusted Local Professionals</h1>
        <p>
          From electricians to painters, find verified experts in your area —
          fast, reliable & secure.
        </p>

        <div className="hero-actions">
          <Link to="/search" className="hero-btn primary">Find Services</Link>
          <Link to="/signup" className="hero-btn secondary">Become a Provider</Link>
        </div>
      </div>
    </div>
  );
}

/* NOT FOUND */
function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
    </div>
  );
}

import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './FooterC';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.post("http://localhost:8000/Login", user);
      
      // Replace alert with toast notification
      toast.success(`Welcome back! Redirecting to dashboard...`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      
      // Delay navigation slightly to allow toast to be seen
      setTimeout(() => {
        const isLoggedIn = JSON.parse(localStorage.getItem("user"));
        switch (isLoggedIn.userType) {
          case "Admin":
            navigate("/AdminHome");
            break;
          case "Ordinary":
            navigate("/HomePage");
            break;
          case "Agent":
            navigate("/AgentHome");
            break;
          default:
            navigate("/Login");
        }
      }, 2000);
      
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        toast.error("Invalid email or password", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      {/* Modern Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <Container>
          <Link to="/" className="navbar-brand fw-bold">
            <i className="bi bi-shield-check me-2"></i>
            ComplaintCare
          </Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
            <Link to="/login" className="nav-link active">Login</Link>
          </div>
        </Container>
      </nav>

      {/* Login Section */}
      <section className="login-section">
        <Container>
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p className="text-muted">Sign in to manage complaints</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <div className="text-end mt-2">
                  <Link to="/forgot-password" className="text-decoration-none small">Forgot password?</Link>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : 'Login'}
              </button>

              <div className="text-center mt-4">
                <p className="text-muted">Don't have an account? <Link to="/SignUp" className="text-primary fw-bold">Sign Up</Link></p>
              </div>
            </form>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
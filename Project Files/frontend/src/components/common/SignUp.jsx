import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert, Form, Button, Dropdown } from 'react-bootstrap';
import Footer from './FooterC';
import './SignUp.css';

const SignUp = () => {
  const [title, setTitle] = useState("Select User Type");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    userType: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleTitle = (select) => {
    setTitle(select);
    setUser({ ...user, userType: select });
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = { ...user, userType: title };
      await axios.post("http://localhost:8000/SignUp", updatedUser);
      
      setSuccess("Account created successfully!");
      setUser({
        name: "",
        email: "",
        password: "",
        phone: "",
        userType: ""
      });
      setTitle("Select User Type");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Modern Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <Container>
          <Link to="/" className="navbar-brand fw-bold">
            <i className="bi bi-shield-check me-2"></i>
            ComplaintCare
          </Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/signup" className="nav-link active">Sign Up</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </div>
        </Container>
      </nav>

      {/* SignUp Section */}
      <section className="signup-section">
        <Container>
          <div className="signup-card">
            <div className="signup-header text-center">
              <h2 className="mb-3">Create Your Account</h2>
              <p className="text-muted mb-4">Join us to manage complaints efficiently</p>
            </div>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
            {success && <Alert variant="success" className="mb-4">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  minLength="8"
                  required
                />
                <Form.Text className="text-muted">
                  Minimum 8 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>User Type</Form.Label>
                <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                  <Dropdown.Toggle variant="outline-primary" className="w-100 text-start">
                    {title}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    <Dropdown.Item onClick={() => handleTitle("Ordinary")}>Ordinary User</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTitle("Admin")}>Admin</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTitle("Agent")}>Agent</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3 py-2"
                disabled={loading || title === "Select User Type"}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </Button>

              <div className="text-center mt-3">
                <p className="text-muted">
                  Already have an account? <Link to="/login" className="text-primary fw-bold">Log in</Link>
                </p>
              </div>
            </Form>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default SignUp;
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image1 from '../../Images/Image1.png';
import Footer from './FooterC';
import './Home.css'; // We'll create this CSS file for custom styles

const Home = () => {
  return (
    <div className="home-page">
      {/* Modern Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">
            <i className="bi bi-shield-check me-2"></i>
            ComplaintCare
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <div className="navbar-nav">
              <Link to="/" className="nav-link active">Home</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
              <Link to="/login" className="nav-link">Login</Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="hero-section py-5">
        <Container className="d-flex align-items-center">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-1 order-2">
              <h1 className="display-4 fw-bold mb-4">
                <span className="text-primary">Empower</span> Your Team,<br />
                <span className="text-primary">Exceed</span> Customer Expectations
              </h1>
              <p className="lead mb-4">
                Our Complaint Management Solution helps you streamline customer issues, 
                improve response times, and boost satisfaction.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login">
                  <Button variant="primary" size="lg" className="px-4 py-2">
                    Register Complaint
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline-primary" size="lg" className="px-4 py-2">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 order-lg-2 order-1 mb-4 mb-lg-0">
              <img 
                src={Image1} 
                alt="Customer Support" 
                className="img-fluid rounded shadow" 
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Why Choose ComplaintCare?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-speedometer2 text-primary fs-1"></i>
                  </div>
                  <h5 className="card-title">Fast Resolution</h5>
                  <p className="card-text">
                    Reduce response times with our streamlined complaint management workflow.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-graph-up text-primary fs-1"></i>
                  </div>
                  <h5 className="card-title">Real-time Tracking</h5>
                  <p className="card-text">
                    Monitor complaint status in real-time with our intuitive dashboard.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-people text-primary fs-1"></i>
                  </div>
                  <h5 className="card-title">Team Collaboration</h5>
                  <p className="card-text">
                    Enable seamless communication between customers, agents, and admins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
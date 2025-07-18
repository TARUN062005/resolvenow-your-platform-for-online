import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FiLogOut, FiUser, FiAlertCircle, FiClock } from 'react-icons/fi';
import Footer from '../common/FooterC';
import Complaint from '../user/Complaint';
import Status from '../user/Status';
import './HomePage.css'; // We'll create this CSS file

const HomePage = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Complaint');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserName(user.name);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [navigate]);

  const handleNavLinkClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      {/* Modern Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center">
            <FiUser className="me-2" size={20} />
            <span className="fw-bold">Welcome, {userName}</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={NavLink}
                active={activeComponent === 'Complaint'}
                onClick={() => handleNavLinkClick('Complaint')}
                className="d-flex align-items-center"
              >
                <FiAlertCircle className="me-1" />
                Register Complaint
              </Nav.Link>
              <Nav.Link 
                as={NavLink}
                active={activeComponent === 'Status'}
                onClick={() => handleNavLinkClick('Status')}
                className="d-flex align-items-center"
              >
                <FiClock className="me-1" />
                Complaint Status
              </Nav.Link>
            </Nav>
            <Button 
              variant="outline-light" 
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <FiLogOut className="me-1" />
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="dashboard-content py-4">
        <Container fluid>
          {activeComponent === 'Complaint' && <Complaint />}
          {activeComponent === 'Status' && <Status />}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { FiLogOut, FiUser, FiUsers, FiHome, FiHelpCircle, FiShield } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import AccordionAdmin from "./AccordionAdmin";
import AgentInfo from './AgentInfo';
import AdminHelp from './AdminHelp';
import './AdminHome.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [userName, setUserName] = useState('');
  const [assignedComplaints, setAssignedComplaints] = useState(new Set());

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setUserName(user.name);
          // Load previously assigned complaints from localStorage
          const savedAssignments = JSON.parse(localStorage.getItem('assignedComplaints')) || [];
          setAssignedComplaints(new Set(savedAssignments));
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

  // Function to mark complaint as assigned
  const markComplaintAssigned = (complaintId) => {
    const updatedAssignments = new Set(assignedComplaints);
    updatedAssignments.add(complaintId);
    setAssignedComplaints(updatedAssignments);
    // Save to localStorage
    localStorage.setItem('assignedComplaints', JSON.stringify(Array.from(updatedAssignments)));
  };

  // Function to check if complaint is already assigned
  const isComplaintAssigned = (complaintId) => {
    return assignedComplaints.has(complaintId);
  };

  return (
    <div className="admin-dashboard">
      <Navbar bg="primary" variant="dark" expand="lg" className="admin-navbar shadow-sm">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center">
            <FiShield className="me-2" size={20} />
            <span className="fw-bold">Admin Panel - {userName}</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                as={NavLink}
                active={activeComponent === 'dashboard'}
                onClick={() => handleNavLinkClick('dashboard')}
                className="d-flex align-items-center"
              >
                <FiHome className="me-1" />
                Dashboard
              </Nav.Link>
              <Nav.Link 
                as={NavLink}
                active={activeComponent === 'UserInfo'}
                onClick={() => handleNavLinkClick('UserInfo')}
                className="d-flex align-items-center"
              >
                <FiUser className="me-1" />
                Users
              </Nav.Link>
              <Nav.Link 
                as={NavLink}
                active={activeComponent === 'Agent'}
                onClick={() => handleNavLinkClick('Agent')}
                className="d-flex align-items-center"
              >
                <FiUsers className="me-1" />
                Agents
              </Nav.Link>
              <Nav.Link 
                as={NavLink}
                active={activeComponent === 'Help'}
                onClick={() => handleNavLinkClick('Help')}
                className="d-flex align-items-center"
              >
                <FiHelpCircle className="me-1" />
                Help Desk
              </Nav.Link>
            </Nav>
            <Button 
              variant="outline-light" 
              onClick={handleLogout}
              className="d-flex align-items-center admin-logout-btn"
            >
              <FiLogOut className="me-1" />
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="admin-content py-4">
        <Container fluid>
          {activeComponent === 'Agent' && (
            <AgentInfo 
              isComplaintAssigned={isComplaintAssigned}
              markComplaintAssigned={markComplaintAssigned}
            />
          )}
          {activeComponent === 'dashboard' && <AccordionAdmin />}
          {activeComponent === 'UserInfo' && <UserInfo />}
          {activeComponent === 'Help' && <AdminHelp />}
        </Container>
      </main>
    </div>
  );
};

export default AdminHome;
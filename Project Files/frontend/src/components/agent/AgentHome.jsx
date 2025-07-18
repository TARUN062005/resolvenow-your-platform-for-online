import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Nav,
  Navbar,
  Card,
  Alert,
  Collapse,
  Badge,
  Spinner
} from 'react-bootstrap';
import {
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import Footer from '../common/FooterC';
import './AgentHome.css';

const AgentHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [expandedChats, setExpandedChats] = useState({});
  const [agentComplaintList, setAgentComplaintList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          navigate('/');
          return;
        }

        const { _id, name } = user;
        setUserName(name);
        setUserData(user);

        const response = await axios.get(`http://localhost:8000/allcomplaints/${_id}`);
        setAgentComplaintList(response.data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusChange = async (complaintId) => {
    const { _id: agentId } = userData;

    try {
      await axios.put(`http://localhost:8000/complaint/${complaintId}`, {
        status: 'completed'
      });

      await axios.put('http://localhost:8000/agentStats/complete', {
        agentId
      });

      // ✅ Update complaint status immediately in UI
      setAgentComplaintList(prev =>
        prev.map(c =>
          (c._id === complaintId ? { ...c, status: 'completed' } : c)
        )
      );

      toast.success('Marked as completed');
      localStorage.setItem('statsUpdated', Date.now());
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const toggleChat = (complaintId) => {
    setExpandedChats(prev => ({
      ...prev,
      [complaintId]: !prev[complaintId]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    toast.info('Logged out successfully');
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in progress':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center">
            <FiUser className="me-2" />
            <span>Agent Dashboard - {userName}</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="agent-navbar" />
          <Navbar.Collapse id="agent-navbar">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="#" className="d-flex align-items-center">
                <FiAlertCircle className="me-1" />
                View Complaints
              </Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout} className="d-flex align-items-center">
              <FiLogOut className="me-1" />
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="agent-content py-4">
        <Container fluid>
          {agentComplaintList.length > 0 ? (
            <div className="complaints-grid">
              {agentComplaintList.map((complaint) => {
                const data = complaint._doc || complaint;
                const id = complaint._id;
                const isOpen = expandedChats[id] || false;
                const isCompleted = data.status === 'completed';

                return (
                  <Card key={id} className="complaint-card shadow-sm">
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between">
                        <span>{data.name}</span>
                        <Badge bg={getStatusBadge(data.status)}>
                          {data.status}
                        </Badge>
                      </Card.Title>

                      <Card.Text className="text-muted small">
                        <strong>Address:</strong> {data.address}, {data.city}, {data.state} - {data.pincode}
                      </Card.Text>

                      <Card.Text className="mt-2">
                        <strong>Description:</strong> {data.comment}
                      </Card.Text>

                      <div className="d-flex gap-2 mt-3">
                        {!isCompleted && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(id)}
                          >
                            <FiCheckCircle className="me-1" />
                            Mark Completed
                          </Button>
                        )}

                        <Button
                          variant={isOpen ? 'outline-secondary' : 'outline-primary'}
                          size="sm"
                          onClick={() => toggleChat(id)}
                        >
                          <FiMessageSquare className="me-1" />
                          {isOpen ? 'Hide Chat' : 'Show Chat'}
                        </Button>
                      </div>

                      <Collapse in={isOpen} className="mt-3">
                        <div>
                          <Card body className="chat-container">
                            <ChatWindow complaintId={id} name={userName} />
                          </Card>
                        </div>
                      </Collapse>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Alert variant="info" className="text-center">
              <Alert.Heading>No Complaints Assigned</Alert.Heading>
              <p>You currently don't have any complaints assigned to you.</p>
            </Alert>
          )}
        </Container>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
};

export default AgentHome;

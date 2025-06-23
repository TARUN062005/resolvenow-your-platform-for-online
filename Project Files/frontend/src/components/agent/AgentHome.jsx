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
    try {
      // First update the complaint status
      const complaintResponse = await axios.put(`http://localhost:8000/complaint/${complaintId}`, { 
        status: 'completed',
        agentId: userData._id
      });
      
      console.log('Complaint update response:', complaintResponse.data);

      // Then update agent stats
      const statsResponse = await axios.put('http://localhost:8000/agentStats/complete', {
        complaintId,
        agentId: userData._id
      });
      
      console.log('Stats update response:', statsResponse.data);

      // Update local state
      setAgentComplaintList(prevComplaints => 
        prevComplaints.filter(complaint => complaint._doc.complaintId !== complaintId)
      );
      
      toast.success('Complaint marked as completed and stats updated');
    } catch (error) {
      console.error('Completion error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
      toast.error('Failed to update complaint status');
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
    switch (status.toLowerCase()) {
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

      <main className="agent-content py-4">
        <Container fluid>
          {agentComplaintList?.length > 0 ? (
            <div className="complaints-grid">
              {agentComplaintList.map((complaint) => {
                const isOpen = expandedChats[complaint._doc.complaintId] || false;
                const isCompleted = complaint._doc.status === 'completed';
                
                return (
                  <Card key={complaint._doc.complaintId} className="complaint-card shadow-sm">
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between">
                        <span>{complaint.name}</span>
                        <Badge bg={getStatusBadge(complaint._doc.status)}>
                          {complaint._doc.status}
                        </Badge>
                      </Card.Title>
                      
                      <Card.Text className="text-muted small">
                        <strong>Address:</strong> {complaint.address}, {complaint.city}, {complaint.state} - {complaint.pincode}
                      </Card.Text>
                      
                      <Card.Text className="mt-2">
                        <strong>Description:</strong> {complaint.comment}
                      </Card.Text>

                      <div className="d-flex gap-2 mt-3">
                        {!isCompleted && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleStatusChange(complaint._doc.complaintId)}
                          >
                            <FiCheckCircle className="me-1" />
                            Mark Completed
                          </Button>
                        )}
                        
                        <Button
                          variant={isOpen ? 'outline-secondary' : 'outline-primary'}
                          size="sm"
                          onClick={() => toggleChat(complaint._doc.complaintId)}
                        >
                          <FiMessageSquare className="me-1" />
                          {isOpen ? 'Hide Chat' : 'Show Chat'}
                        </Button>
                      </div>

                      <Collapse in={isOpen} className="mt-3">
                        <div>
                          <Card body className="chat-container">
                            <ChatWindow 
                              complaintId={complaint._doc.complaintId} 
                              name={userName} 
                            />
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
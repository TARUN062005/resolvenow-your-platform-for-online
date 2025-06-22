import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  Card, 
  Dropdown, 
  Alert, 
  Badge,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { 
  FiUser, 
  FiMail, 
  FiMapPin, 
  FiMessageSquare, 
  FiCheckCircle,
  FiUsers,
  FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import './AccordionAdmin.css'; // New CSS file for styling

const AccordionAdmin = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintsRes, agentsRes] = await Promise.all([
          axios.get('http://localhost:8000/status'),
          axios.get('http://localhost:8000/AgentUsers')
        ]);
        setComplaintList(complaintsRes.data);
        setAgentList(agentsRes.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignment = async (agentId, complaintId, status, agentName) => {
    try {
      await axios.post('http://localhost:8000/assignedComplaints', {
        agentId,
        complaintId,
        status,
        agentName
      });
      
      setComplaintList(prev => prev.filter(c => c._id !== complaintId));
      toast.success(`Complaint assigned to ${agentName}`);
    } catch (error) {
      console.error(error);
      toast.error('Assignment failed');
    }
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="admin-accordion-container">
      <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
        {/* Complaints Section */}
        <Accordion.Item eventKey="0" className="mb-3 border-0">
          <Accordion.Header className="accordion-header">
            <FiAlertCircle className="me-2" />
            Users Complaints
          </Accordion.Header>
          <Accordion.Body className="p-3">
            {complaintList.length > 0 ? (
              <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                {complaintList.map((complaint) => (
                  <Col key={complaint._id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title className="d-flex justify-content-between">
                          <span>
                            <FiUser className="me-2" />
                            {complaint.name}
                          </span>
                          <Badge bg={getStatusBadge(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </Card.Title>
                        
                        <Card.Text className="text-muted small">
                          <FiMapPin className="me-2" />
                          {complaint.address}, {complaint.city}, {complaint.state} - {complaint.pincode}
                        </Card.Text>
                        
                        <Card.Text>
                          <FiMessageSquare className="me-2" />
                          {complaint.comment}
                        </Card.Text>

                        {complaint.status !== "completed" && (
                          <Dropdown className="mt-2">
                            <Dropdown.Toggle variant="outline-primary" size="sm">
                              Assign Agent
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {agentList.map((agent) => (
                                <Dropdown.Item 
                                  key={agent._id}
                                  onClick={() => handleAssignment(
                                    agent._id, 
                                    complaint._id, 
                                    complaint.status, 
                                    agent.name
                                  )}
                                >
                                  {agent.name}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="text-center">
                <Alert.Heading>No complaints to show</Alert.Heading>
              </Alert>
            )}
          </Accordion.Body>
        </Accordion.Item>

        {/* Agents Section */}
        <Accordion.Item eventKey="1" className="border-0">
          <Accordion.Header className="accordion-header">
            <FiUsers className="me-2" />
            Agents
          </Accordion.Header>
          <Accordion.Body className="p-3">
            {agentList.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {agentList.map((agent) => (
                  <Col key={agent._id}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>
                          <FiUser className="me-2" />
                          {agent.name}
                        </Card.Title>
                        <Card.Text>
                          <FiMail className="me-2" />
                          {agent.email}
                        </Card.Text>
                        <Card.Text>
                          <FiCheckCircle className="me-2 text-success" />
                          Active Agent
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="text-center">
                <Alert.Heading>No agents to show</Alert.Heading>
              </Alert>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default AccordionAdmin;
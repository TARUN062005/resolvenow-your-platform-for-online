import React, { useState, useEffect } from 'react';
import {
  Accordion,
  Card,
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
import './AccordionAdmin.css';

const AccordionAdmin = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Fetch error:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignment = async (agentId, complaintId, status, agentName) => {
    try {
      const alreadyAssigned = complaintList.find(c => c._id === complaintId)?.assignedTo;
      if (alreadyAssigned) {
        toast.warning('Complaint already assigned');
        return;
      }

      await axios.post('http://localhost:8000/assignedComplaints', {
        agentId,
        complaintId,
        status,
        agentName
      });

      setComplaintList(prev =>
        prev.map(c =>
          c._id === complaintId ? { ...c, assignedTo: agentName } : c
        )
      );

      toast.success(`Complaint assigned to ${agentName}`);
      localStorage.setItem('statsUpdated', Date.now());

    } catch (error) {
      console.error('Assign error:', error.response?.data || error.message);
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

                        {complaint.assignedTo ? (
                          <Card.Text className="text-success">
                            <FiCheckCircle className="me-2" />
                            Assigned To: {complaint.assignedTo}
                          </Card.Text>
                        ) : (
                          <div className="d-flex mt-2 gap-2 align-items-center">
                            <select
                              className="form-select form-select-sm"
                              onChange={(e) => {
                                const [agentId, agentName] = e.target.value.split('|');
                                if (agentId && agentName) {
                                  handleAssignment(agentId, complaint._id, complaint.status, agentName);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>Select agent</option>
                              {agentList.map((agent) => (
                                <option key={agent._id} value={`${agent._id}|${agent.name}`}>
                                  {agent.name}
                                </option>
                              ))}
                            </select>
                          </div>
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

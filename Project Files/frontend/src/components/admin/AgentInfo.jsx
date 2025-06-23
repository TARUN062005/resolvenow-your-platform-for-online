import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Table, 
  Alert, 
  Container, 
  Collapse, 
  Form, 
  Badge,
  Modal
} from 'react-bootstrap';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit2, 
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiList,
  FiCheck
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './AgentInfo.css';

const AgentInfo = ({ isComplaintAssigned, markComplaintAssigned }) => {
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [updateAgent, setUpdateAgent] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const fetchAgentsWithStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching agents and stats...'); // Debug log
      
      const agentsResponse = await axios.get('http://localhost:8000/agentUsers');
      console.log('Agents response:', agentsResponse.data); // Debug log
      
      // First check if we got any agents
      if (!agentsResponse.data || agentsResponse.data.length === 0) {
        console.log('No agents found in response');
        setAgentList([]);
        return;
      }

      // Then try to get stats
      try {
        const statsResponse = await axios.get('http://localhost:8000/agentStats');
        console.log('Stats response:', statsResponse.data); // Debug log
        
        const agentsWithStats = agentsResponse.data.map(agent => {
          const agentStats = statsResponse.data.find(a => a._id === agent._id)?.stats || {
            assigned: 0,
            inProgress: 0,
            completed: 0
          };
          return { ...agent, stats: agentStats };
        });
        
        console.log('Merged agents with stats:', agentsWithStats); // Debug log
        setAgentList(agentsWithStats);
      } catch (statsError) {
        console.error('Error fetching stats, using default stats:', statsError);
        // If stats endpoint fails, just use the agents with default stats
        const agentsWithDefaultStats = agentsResponse.data.map(agent => ({
          ...agent,
          stats: {
            assigned: 0,
            inProgress: 0,
            completed: 0
          }
        }));
        setAgentList(agentsWithDefaultStats);
      }
    } catch (error) {
      console.error('Error in fetchAgentsWithStats:', error);
      toast.error('Failed to load agent data');
      setAgentList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsWithStats();
  }, []);

  const handleChange = (e) => {
    setUpdateAgent({ ...updateAgent, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (agentId) => {
    if (!updateAgent.name && !updateAgent.email && !updateAgent.phone) {
      toast.warning('Please fill at least one field');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/user/${agentId}`, updateAgent);
      console.log('Update response:', response); // Debug log
      toast.success('Agent updated successfully');
      setExpandedRow(null);
      setUpdateAgent({ name: '', email: '', phone: '' });
      await fetchAgentsWithStats();
    } catch (error) {
      console.error('Update error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      toast.error('Failed to update agent');
    }
  };

  const confirmDelete = (agentId) => {
    setAgentToDelete(agentId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      console.log('Deleting agent:', agentToDelete); // Debug log
      const response = await axios.delete(`http://localhost:8000/agentUsers/${agentToDelete}`);
      console.log('Delete response:', response); // Debug log
      setAgentList(agentList.filter((agent) => agent._id !== agentToDelete));
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      toast.error('Failed to delete agent');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const toggleRow = (agentId) => {
    setExpandedRow(expandedRow === agentId ? null : agentId);
    if (expandedRow === agentId) {
      setUpdateAgent({ name: '', email: '', phone: '' });
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
    <Container fluid className="agent-info-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">
          <FiUser className="me-2" />
          Agent Management
        </h4>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={fetchAgentsWithStats}
        >
          <FiRefreshCw className="me-1" />
          Refresh
        </Button>
      </div>

      {agentList.length > 0 ? (
        <div className="table-responsive">
          <Table striped hover className="agent-table">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>
                  <FiList className="me-1" />
                  Assigned
                </th>
                <th>
                  <FiClock className="me-1" />
                  In Progress
                </th>
                <th>
                  <FiCheck className="me-1" />
                  Completed
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agentList.map((agent) => (
                <React.Fragment key={agent._id}>
                  <tr>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone || 'N/A'}</td>
                    <td>{agent.stats.assigned}</td>
                    <td>{agent.stats.inProgress}</td>
                    <td>{agent.stats.completed}</td>
                    <td>
                      <Badge bg="success" pill>
                        <FiCheckCircle className="me-1" />
                        Active
                      </Badge>
                    </td>
                    <td className="action-buttons">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => toggleRow(agent._id)}
                        className="me-2"
                      >
                        <FiEdit2 className="me-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => confirmDelete(agent._id)}
                      >
                        <FiTrash2 className="me-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={8} className="p-0 border-0">
                      <Collapse in={expandedRow === agent._id}>
                        <div className="update-form-container p-3 bg-light">
                          <Form onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdate(agent._id);
                          }}>
                            <h5 className="mb-3">Update Agent Details</h5>
                            <Form.Group className="mb-3">
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={updateAgent.name}
                                onChange={handleChange}
                                placeholder={agent.name}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={updateAgent.email}
                                onChange={handleChange}
                                placeholder={agent.email}
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Phone</Form.Label>
                              <Form.Control
                                type="tel"
                                name="phone"
                                value={updateAgent.phone}
                                onChange={handleChange}
                                placeholder={agent.phone || 'Enter phone'}
                              />
                            </Form.Group>
                            <div className="d-flex justify-content-end gap-2">
                              <Button
                                variant="outline-secondary"
                                onClick={() => setExpandedRow(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                type="submit"
                              >
                                Update Agent
                              </Button>
                            </div>
                          </Form>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="info" className="text-center">
          <Alert.Heading>No Agents Found</Alert.Heading>
          <p>There are currently no agents registered in the system.</p>
        </Alert>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this agent? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Agent
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AgentInfo;
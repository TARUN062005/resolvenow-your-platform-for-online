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

const AgentInfo = () => {
  const navigate = useNavigate();
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [updateAgent, setUpdateAgent] = useState({ name: '', email: '', phone: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  const fetchAgentsWithStats = async () => {
    try {
      setLoading(true);
      const [agentsRes, complaintsRes] = await Promise.all([
        axios.get('http://localhost:8000/agentUsers'),
        axios.get('http://localhost:8000/status')
      ]);

      const agentStatsMap = {};

      complaintsRes.data.forEach(complaint => {
        const agentName = complaint.assignedTo;
        const status = complaint.status;

        if (!agentName) return;

        const agent = agentsRes.data.find(a => a.name === agentName);
        if (!agent) return;

        if (!agentStatsMap[agent._id]) {
          agentStatsMap[agent._id] = { assigned: 0, completed: 0 };
        }

        agentStatsMap[agent._id].assigned++;

        if (status === 'completed') {
          agentStatsMap[agent._id].completed++;
        }
      });

      const agentsWithStats = agentsRes.data.map(agent => {
        const stats = agentStatsMap[agent._id] || { assigned: 0, completed: 0 };
        const inProgress = stats.assigned - stats.completed;
        return {
          ...agent,
          stats: {
            assigned: stats.assigned,
            completed: stats.completed,
            inProgress: inProgress < 0 ? 0 : inProgress
          }
        };
      });

      setAgentList(agentsWithStats);
    } catch (error) {
      toast.error('Failed to load agent data');
      setAgentList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsWithStats();

    const handleStorageUpdate = () => {
      if (localStorage.getItem('statsUpdated')) {
        fetchAgentsWithStats();
        localStorage.removeItem('statsUpdated');
      }
    };

    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
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
      await axios.put(`http://localhost:8000/user/${agentId}`, updateAgent);
      toast.success('Agent updated successfully');
      setExpandedRow(null);
      setUpdateAgent({ name: '', email: '', phone: '' });
      await fetchAgentsWithStats();
    } catch (error) {
      toast.error('Failed to update agent');
    }
  };

  const confirmDelete = (agentId) => {
    setAgentToDelete(agentId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/agentUsers/${agentToDelete}`);
      setAgentList(agentList.filter((agent) => agent._id !== agentToDelete));
      toast.success('Agent deleted successfully');
    } catch (error) {
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
          <FiUser className="me-2" /> Agent Management
        </h4>
        <Button variant="outline-primary" size="sm" onClick={fetchAgentsWithStats}>
          <FiRefreshCw className="me-1" /> Refresh
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
                <th><FiList className="me-1" /> Assigned</th>
                <th><FiClock className="me-1" /> In Progress</th>
                <th><FiCheck className="me-1" /> Completed</th>
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
                        <FiCheckCircle className="me-1" /> Active
                      </Badge>
                    </td>
                    <td className="action-buttons">
                      <Button variant="outline-primary" size="sm" onClick={() => toggleRow(agent._id)} className="me-2">
                        <FiEdit2 className="me-1" /> Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(agent._id)}>
                        <FiTrash2 className="me-1" /> Delete
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
                              <Button variant="outline-secondary" onClick={() => setExpandedRow(null)}>
                                Cancel
                              </Button>
                              <Button variant="primary" type="submit">
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
        <Modal.Body>Are you sure you want to delete this agent? This action cannot be undone.</Modal.Body>
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

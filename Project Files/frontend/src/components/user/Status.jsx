import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Alert, Button, Badge, Collapse } from 'react-bootstrap';
import { FiMessageSquare, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ChatWindow from '../common/ChatWindow';
import './Status.css'; // We'll create this CSS file

const Status = () => {
  const [toggle, setToggle] = useState({});
  const [statusCompliants, setStatusCompliants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const { _id } = user;
        const response = await axios.get(`http://localhost:8000/status/${_id}`);
        setStatusCompliants(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleToggle = (complaintId) => {
    setToggle((prevState) => ({
      ...prevState,
      [complaintId]: !prevState[complaintId],
    }));
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
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
    <div className="status-container">
      {statusCompliants.length > 0 ? (
        <div className="complaints-grid">
          {statusCompliants.map((complaint) => {
            const open = toggle[complaint._id] || false;
            return (
              <Card key={complaint._id} className="complaint-card shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title className="mb-2">
                        {complaint.name}
                        <Badge bg={getStatusVariant(complaint.status)} className="ms-2">
                          {complaint.status}
                        </Badge>
                      </Card.Title>
                      <Card.Text className="text-muted small mb-1">
                        <strong>Address:</strong> {complaint.address}
                      </Card.Text>
                      <Card.Text className="text-muted small mb-1">
                        <strong>City:</strong> {complaint.city}, {complaint.state} - {complaint.pincode}
                      </Card.Text>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleToggle(complaint._id)}
                      aria-controls={`collapse-${complaint._id}`}
                      aria-expanded={open}
                    >
                      {open ? <FiChevronUp /> : <FiMessageSquare />}
                    </Button>
                  </div>

                  <Card.Text className="mt-3">
                    <strong>Description:</strong> {complaint.comment}
                  </Card.Text>

                  <Collapse in={open}>
                    <div id={`collapse-${complaint._id}`} className="mt-3">
                      <Card body className="chat-container">
                        <ChatWindow 
                          key={complaint._id} 
                          complaintId={complaint._id} 
                          name={complaint.name} 
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
          <Alert.Heading>No complaints found</Alert.Heading>
          <p>You haven't submitted any complaints yet.</p>
        </Alert>
      )}
    </div>
  );
};

export default Status;
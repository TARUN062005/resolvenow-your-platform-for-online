import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Alert, Card, FloatingLabel } from 'react-bootstrap';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Complaint = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [userComplaint, setUserComplaint] = useState({
    userId: user._id,
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'pending',
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserComplaint({ ...userComplaint, [name]: value });
  };

  const handleClear = () => {
    setUserComplaint({
      ...userComplaint,
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      comment: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { _id } = user;
      await axios.post(`http://localhost:8000/Complaint/${_id}`, userComplaint);
      
      toast.success('Your complaint has been submitted successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      handleClear();
    } catch (err) {
      toast.error('Something went wrong! Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <Card.Title className="mb-4">Register New Complaint</Card.Title>
        
        <Form onSubmit={handleSubmit}>
          <div className="row g-3">
            <Form.Group className="col-md-6">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userComplaint.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="col-md-6">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={userComplaint.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
              />
            </Form.Group>

            <Form.Group className="col-md-6">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={userComplaint.city}
                onChange={handleChange}
                required
                placeholder="Enter your city"
              />
            </Form.Group>

            <Form.Group className="col-md-6">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={userComplaint.state}
                onChange={handleChange}
                required
                placeholder="Enter your state"
              />
            </Form.Group>

            <Form.Group className="col-md-6">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                name="pincode"
                value={userComplaint.pincode}
                onChange={handleChange}
                required
                placeholder="Enter pincode"
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit pincode"
              />
            </Form.Group>

            <Form.Group className="col-md-6">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={userComplaint.status}
                onChange={handleChange}
                required
                readOnly
                className="bg-light"
              />
            </Form.Group>

            <Form.Group className="col-12">
              <Form.Label>Description</Form.Label>
              <FloatingLabel controlId="floatingTextarea" label="Describe your complaint in detail">
                <Form.Control
                  as="textarea"
                  name="comment"
                  value={userComplaint.comment}
                  onChange={handleChange}
                  required
                  style={{ height: '100px' }}
                  placeholder="Describe your complaint in detail"
                />
              </FloatingLabel>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="outline-secondary"
                onClick={handleClear}
                disabled={loading}
              >
                <FiTrash2 className="me-1" />
                Clear
              </Button>
              
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="me-1" />
                    Submit Complaint
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Complaint;
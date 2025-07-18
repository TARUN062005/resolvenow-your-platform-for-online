import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { Container, Modal } from 'react-bootstrap';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Footer from '../common/FooterC';
import axios from 'axios';

const UserInfo = () => {
  const navigate = useNavigate();
  const [ordinaryList, setOrdinaryList] = useState([]);
  const [toggle, setToggle] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ show: false, message: '', variant: '' });

  const [updateUser, setUpdateUser] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (user_id) => {
    if (updateUser === "") {
      setDeleteStatus({ show: true, message: "At least 1 field needs to be filled", variant: 'danger' });
      setTimeout(() => setDeleteStatus({ ...deleteStatus, show: false }), 3000);
    } else {
      try {
        const res = await axios.put(`http://localhost:8000/user/${user_id}`, updateUser);
        setDeleteStatus({ show: true, message: 'User updated successfully', variant: 'success' });
        setTimeout(() => setDeleteStatus({ ...deleteStatus, show: false }), 3000);
        JSON.stringify(res.data);
      } catch (err) {
        setDeleteStatus({ show: true, message: err.message, variant: 'danger' });
        setTimeout(() => setDeleteStatus({ ...deleteStatus, show: false }), 3000);
      }
    }
  };

  // Delete confirmation modal handlers
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${userToDelete}`);
      setOrdinaryList(ordinaryList.filter((user) => user._id !== userToDelete));
      setDeleteStatus({ show: true, message: 'User deleted successfully', variant: 'success' });
      setTimeout(() => setDeleteStatus({ ...deleteStatus, show: false }), 3000);
    } catch (error) {
      setDeleteStatus({ show: true, message: error.message, variant: 'danger' });
      setTimeout(() => setDeleteStatus({ ...deleteStatus, show: false }), 3000);
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const getOrdinaryRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8000/OrdinaryUsers');
        setOrdinaryList(response.data);
      } catch (error) {
        setDeleteStatus({ show: true, message: error.message, variant: 'danger' });
        setTimeout(() => setDeleteStatus({ ...deleteStatus, show: false }), 3000);
      }
    };
    getOrdinaryRecords();
  }, [navigate]);

  const handleToggle = (userId) => {
    setToggle((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  return (
    <>
      <div className="body">
        <Container>
          {/* Status Alert */}
          {deleteStatus.show && (
            <Alert variant={deleteStatus.variant} onClose={() => setDeleteStatus({ ...deleteStatus, show: false })} dismissible>
              {deleteStatus.message}
            </Alert>
          )}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ordinaryList.length > 0 ? (
                ordinaryList.map((user) => {
                  const open = toggle[user._id] || false;
                  return (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <Button 
                            onClick={() => handleToggle(user._id)}
                            aria-controls={`collapse-${user._id}`}
                            aria-expanded={open}
                            variant="outline-warning"
                            size="sm"
                          >
                            Update
                          </Button>
                          
                          <Button 
                            onClick={() => handleDeleteClick(user._id)}
                            variant="outline-danger"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>

                        <Collapse in={open}>
                          <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(user._id); }} className="p-3 bg-light mt-2 rounded">
                            <Form.Group className="mb-3" controlId={`formName-${user._id}`}>
                              <Form.Label>Full Name</Form.Label>
                              <Form.Control 
                                name="name" 
                                value={updateUser.name} 
                                onChange={handleChange} 
                                type="text" 
                                placeholder="Enter name" 
                              />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId={`formEmail-${user._id}`}>
                              <Form.Label>Email address</Form.Label>
                              <Form.Control 
                                name="email" 
                                value={updateUser.email} 
                                onChange={handleChange} 
                                type="email" 
                                placeholder="Enter email" 
                              />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId={`formPhone-${user._id}`}>
                              <Form.Label>Phone</Form.Label>
                              <Form.Control 
                                name="phone" 
                                value={updateUser.phone} 
                                onChange={handleChange} 
                                type="tel" 
                                placeholder="Enter Phone no." 
                              />
                            </Form.Group>
                            <Button size="sm" variant="success" type="submit">
                              Save Changes
                            </Button>
                          </Form>
                        </Collapse>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>
                    <Alert variant="info">
                      <Alert.Heading>No Users to show</Alert.Heading>
                    </Alert>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Container>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this user? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete User
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default UserInfo;
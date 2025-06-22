import React from 'react';
import { 
  Card, 
  Tabs, 
  Tab, 
  ListGroup, 
  Button, 
  Badge 
} from 'react-bootstrap';
import { 
  FiBook, 
  FiTool, 
  FiPhone, 
  FiMail, 
  FiAlertTriangle,
  FiUser,
  FiSettings,
  FiFileText
} from 'react-icons/fi';
import './AdminHelp.css';

const AdminHelp = () => {
  const quickGuides = [
    { title: 'User Management', icon: <FiUser />, content: 'How to add, edit, and manage users' },
    { title: 'Agent Assignment', icon: <FiTool />, content: 'Process for assigning complaints to agents' },
    { title: 'System Settings', icon: <FiSettings />, content: 'Configuring system preferences and options' },
    { title: 'Report Generation', icon: <FiFileText />, content: 'Creating and exporting system reports' }
  ];

  const supportContacts = [
    { method: 'Email', icon: <FiMail />, details: 'support@complaintcare.com', response: '24 hours' },
    { method: 'Phone', icon: <FiPhone />, details: '+1 (800) 123-4567', response: 'Immediate', emergency: true },
    { method: 'Ticketing', icon: <FiTool />, details: 'System dashboard', response: '48 hours' }
  ];

  return (
    <Card className="admin-help-dashboard shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4 d-flex align-items-center">
          <FiTool className="me-2" size={24} />
          Admin Help Center
        </Card.Title>
        
        <Tabs defaultActiveKey="guides" className="mb-3">
          <Tab eventKey="guides" title={
            <span><FiBook className="me-1" /> Quick Guides</span>
          }>
            <div className="row mt-3 g-4">
              {quickGuides.map((guide, index) => (
                <div key={index} className="col-md-6">
                  <Card className="h-100 guide-card">
                    <Card.Body>
                      <div className="d-flex align-items-start">
                        <div className="guide-icon me-3">
                          {guide.icon}
                        </div>
                        <div>
                          <h5>{guide.title}</h5>
                          <p className="text-muted mb-0">{guide.content}</p>
                        </div>
                      </div>
                      <Button variant="outline-primary" size="sm" className="mt-3">
                        View Guide
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Tab>
          
          <Tab eventKey="support" title={
            <span><FiPhone className="me-1" /> Support Contacts</span>
          }>
            <ListGroup variant="flush" className="mt-3">
              {supportContacts.map((contact, index) => (
                <ListGroup.Item 
                  key={index} 
                  className={contact.emergency ? 'emergency-contact' : ''}
                >
                  <div className="d-flex align-items-center">
                    <div className="contact-icon me-3">
                      {contact.icon}
                    </div>
                    <div className="flex-grow-1">
                      <h6>{contact.method}</h6>
                      <p className="mb-1">{contact.details}</p>
                      <small className="text-muted">Response time: {contact.response}</small>
                    </div>
                    {contact.emergency && (
                      <Badge bg="danger" pill>
                        <FiAlertTriangle className="me-1" />
                        Emergency
                      </Badge>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab>
          
          <Tab eventKey="resources" title={
            <span><FiFileText className="me-1" /> Resources</span>
          }>
            <div className="mt-3">
              <h5>Administrative Resources</h5>
              <ul className="resource-list">
                <li>System Administration Manual (PDF)</li>
                <li>Complaint Handling Procedures</li>
                <li>User Management Guidelines</li>
                <li>Monthly Reporting Templates</li>
              </ul>
              <Button variant="primary" className="mt-3">
                Download All Resources
              </Button>
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AdminHelp;
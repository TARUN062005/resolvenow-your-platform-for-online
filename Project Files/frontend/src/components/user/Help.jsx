import React from 'react';
import { Card, Accordion } from 'react-bootstrap';
import { FiHelpCircle, FiCheckCircle } from 'react-icons/fi';
import './Help.css'; // We'll create this next

const Help = () => {
  const helpSteps = [
    {
      title: "How to Register a Complaint",
      steps: [
        "Navigate to the 'Complaint Register' section",
        "Fill in all required personal details",
        "Provide accurate address information",
        "Describe your complaint clearly in the description box",
        "Click 'Submit Complaint' to register"
      ]
    },
    {
      title: "Checking Complaint Status",
      steps: [
        "Go to the 'Status' section",
        "View your submitted complaints",
        "Check the status badge (Pending/In Progress/Resolved)",
        "Click 'Message' to chat with support if needed"
      ]
    },
    {
      title: "Getting Additional Help",
      steps: [
        "For urgent issues, call our support line: 1800-123-4567",
        "Email us at support@complaintcare.com",
        "Visit our FAQ section on the website",
        "Check the notification center for updates"
      ]
    }
  ];

  return (
    <Card className="help-card shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex align-items-center mb-4">
          <FiHelpCircle className="me-2" size={24} />
          Help Center
        </Card.Title>
        
        <Accordion defaultActiveKey="0">
          {helpSteps.map((section, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{section.title}</Accordion.Header>
              <Accordion.Body>
                <ul className="help-steps-list">
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="d-flex align-items-start mb-2">
                      <FiCheckCircle className="me-2 mt-1 text-success" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default Help;
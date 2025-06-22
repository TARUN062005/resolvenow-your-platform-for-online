import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ChatWindow = ({ complaintId, name }) => {
  const [messageInput, setMessageInput] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messageWindowRef = useRef(null);

  const fetchMessageList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/messages/${complaintId}`);
      setMessageList(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    if (complaintId) {
      fetchMessageList();
    }
  }, [complaintId, fetchMessageList]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const data = {
        name,
        message: messageInput,
        complaintId
      };
      
      await axios.post('http://localhost:8000/messages', data);
      setMessageInput('');
      await fetchMessageList(); // Refresh the message list
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  };

  return (
    <div className="chat-container">
      <h1>Message Box</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="message-window" ref={messageWindowRef}>
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : messageList.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          messageList.slice().reverse().map((msg) => (
            <div className="message" key={msg._id}>
              <p><strong>{msg.name}:</strong> {msg.message}</p>
              <p className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, 
                {new Date(msg.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
      
      <div className="input-container">
        <textarea
          required
          placeholder="Type your message here..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="btn btn-success" 
          onClick={sendMessage}
          disabled={!messageInput.trim() || isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  complaintId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default ChatWindow;
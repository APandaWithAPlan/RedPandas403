// src/components/Call.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Call.css';



const Call = ({localStream, remoteStream})  => {
  // Access selectedCourse from location state
  const localVidRef = useRef(null);
  const remoteVidRef = useRef(null);
  useEffect(() => 
  { if (localVidRef.current) {localVidRef.current = localStream}
    if (remoteVidRef.current) {remoteVidRef.current = remoteStream}
  }, [localStream,remoteStream])

  const location = useLocation();
  const { selectedCourse } = location.state || {};

  // State management for mic, camera, chat logs, and current message
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [chatLogs, setChatLogs] = useState([
    { user: 'ExampleUser', message: 'Example Message' },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  // References for video elements
  //const answererVideoRef = useRef(null);
  //const callerVideoRef = useRef(null);


  // Placeholder functions for button actions
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Add WebRTC code to handle mic toggle
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // Add WebRTC code to handle camera toggle
  };

  const endCall = () => {
    // Add functionality to end the call and clean up resources
  };

  // Function to handle sending messages
  const sendMessage = () => {
    if (currentMessage.trim() === '') return; // Avoid sending empty messages

    // Add the new message to the chat logs
    setChatLogs([...chatLogs, { user: 'You', message: currentMessage }]);
    setCurrentMessage(''); // Clear the input field
  };

  // Handle "Enter" key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  // Handle missing selectedCourse
  if (!selectedCourse) {
    return <div>Please select a course from the homepage.</div>;
  }

  return (
    <div className="call-container">
      <div className="main-section">
        <div className="video-section">
          <div className="video-box" id="answerer">
            <video
              ref={localVidRef}
              autoPlay
              playsInline
              className="video-element"
            >
              {/* Add WebRTC code to show the answerer's stream */}
            </video>
            <div className="label">Answerer Camera</div>
          </div>
          <div className="video-box" id="caller">
            <video
              ref={remoteVidRef}
              autoPlay
              playsInline
              className="video-element"
            >
              {/* Add WebRTC code to show the caller's stream */}
            </video>
            <div className="label">Caller Camera</div>
          </div>
        </div>

        <div className="chat-section">
          <h2 className="chat-label">Chats</h2>
          <div className="chat-logs">
            {chatLogs.map((chat, index) => (
              <div key={index} className="chat-message">
                <strong>{chat.user}:</strong> {chat.message}
              </div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Type chat text here"
            className="chat-input"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>

      <div className="controls">
        <button
          onClick={() => console.log('Time placeholder')}
          className="control-button"
        >
          Time
        </button>
        <button onClick={toggleMic} className="control-button">
          {isMicOn ? 'Mic On' : 'Mic Off'}
        </button>
        <button onClick={toggleCamera} className="control-button">
          {isCameraOn ? 'Camera On' : 'Camera Off'}
        </button>
        <button onClick={endCall} className="control-button end-call">
          <Link to="/">End Call</Link>
        </button>
      </div>
    </div>
  );
};

export default Call;

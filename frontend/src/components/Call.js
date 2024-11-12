// src/components/Call.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { addAnswer } from './connectionSetup.js';
import { localStream, remoteStream } from './connectionSetup.js';
import { socket } from './connectionSetup.js';
import { call } from './connectionSetup.js';
import './Call.css';



const Call = ()  => {
    // Access selectedCourse from location state
    const [offers, setOffers] = useState([]); 
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [chatLogs, setChatLogs] = useState([
    { user: 'ExampleUser', message: 'Example Message' },
    ]);
    const [currentMessage, setCurrentMessage] = useState('');

    // updates the state of the streams with every render
    const localBinder = useRef(null);
    const remoteBinder = useRef(null);

    const location = useLocation();
    const { selectedCourse } = location.state || {};

    const connectToButtons = (offers) => {
        const offerContainer = document.getElementByID('offer-buttons');
        offerContainer.innerHTML = '';

        // create an answer button for every offer
        offers.forEach((offer) => {
            const answerButton = document.createElement('button');
            answerButton.textContent('Answer');
            answerButton.addEventListener('click', () => {
                addAnswer(offer);
            });
            offerContainer.appendChild(answerButton);
        });
    };

    useEffect(() => {
        if (localBinder.current) {
            localBinder.current.srcObject = localStream;
        }
        if (remoteBinder.current) {
            remoteBinder.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream]);

    // event handlers
    useEffect(() => {
        socket.on('newOfferAwaiting', (offer) => {
            setOffers((pastOffers) => [...pastOffers, offer]);
            connectToButtons(offers);
        });
    }, [offers]);

    useEffect(() => {
        socket.on('availableOffers', (offers) => {
            setOffers(offers);
            connectToButtons(offers);
        });
    }, [offers]);

    useEffect(() => {
        socket.on('answerResponse', (offerObj) => {
            addAnswer(offerObj);
        })
    }, []);

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

    const sendMessage = () => {
    if (currentMessage.trim() === '') return; // Avoid sending empty messages

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
                <div className="video-box">
                    <video
                        id="local-video"
                        ref={localBinder}
                        autoPlay
                        playsInline
                        className="video-element"
                    >

                    {/* Add WebRTC code to show the answerer's stream */}
                    </video>
                    <div className="label">Answerer Camera</div>
                </div>
                <div className="video-box">
                    <video
                        id="remote-video"
                        ref={remoteBinder}
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

            <div id = "offer-buttons"></div>

        </div>

        <div className="controls">
            <button onClick={() => console.log('Time placeholder')} className="control-button">
                Time
            </button>
            <button onClick={call} classname="startCall"> 
                Start Call
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

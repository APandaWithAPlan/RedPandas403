// src/components/Call.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {socketConnection} from './connectionSetup.js';
import './Call.css';



const Call = ({remoteStream, localStream,peerConnection,callStatus,updateCallStatus,userName})  => {

    // Access selectedCourse from location state
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [chatLogs, setChatLogs] = useState([{ user: 'ExampleUser', message: 'Example Message' },]);
    const [currentMessage, setCurrentMessage] = useState('');

    const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const navigate = useNavigate();
    //const [ videoMessage, setVideoMessage ] = useState("Please enable video to start!")
    const [ offerCreated, setOfferCreated ] = useState(false)

    const location = useLocation();
    const { selectedCourse } = location.state || {};

    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate(`/`)
        }else{
            //set video tags
            remoteFeedEl.current.srcObject = remoteStream
            localFeedEl.current.srcObject = localStream            
        }
    },[])
    
    //set video tags
    // useEffect(()=>{
    //     remoteFeedEl.current.srcObject = remoteStream
    //     localFeedEl.current.srcObject = localStream
    // },[])

    //once the user has shared video, start WebRTC'ing :)
    useEffect(()=>{
        const shareVideoAsync = async()=>{
            const offer = await peerConnection.createOffer()
            peerConnection.setLocalDescription(offer)
            //we can now start collecing ice candidates!
            // we need to emit the offer to the server
            const socket = socketConnection(userName)
            socket.emit('newOffer',offer)
            setOfferCreated(true) //so that our useEffect doesn't make an offer again
            console.log("created offer, setLocalDesc, emitted offer, updated videoMessage")
        }
        if(!offerCreated && callStatus.videoEnabled){
            //CREATE AN OFFER!!
            console.log("We have video and no offer... making offer")
            shareVideoAsync()
        }
    },[callStatus.videoEnabled,offerCreated])
    

    useEffect(()=>{
        const addAnswerAsync = async()=>{
            await peerConnection.setRemoteDescription(callStatus.answer)
            console.log("Answer added!!")
        }
        if(callStatus.answer){
            addAnswerAsync()
        }
    },[callStatus])

    // Placeholder functions for button actions
    const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Add WebRTC code to handle mic toggle
    };

    const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
        // Add WebRTC code to handle camera toggle
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

    // End the call button functionality
    const endCall = () => {
        // TODO
    };

    // Handle missing selectedCourse
    if (!selectedCourse) {
        return <div>Please select a course from the homepage.</div>;
    };

    return (
    <div className="call-container">
        <div className="main-section">
            <div className="video-section">
                <div className="video-box">
                    <video
                        id="local-video"
                        ref={localFeedEl}
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
                        ref={remoteFeedEl}
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

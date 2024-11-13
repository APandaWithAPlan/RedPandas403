import { useEffect, useRef, useState } from "react";
import './Answer.css'
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { socketConnection } from './connectionSetup.js'

const AnswerVideo = ({remoteStream, localStream,peerConnection,
    callStatus,updateCallStatus,offerData,userName})=>{
    const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const navigate = useNavigate();
    const [ answerCreated, setAnswerCreated ] = useState(false)
    
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [chatLogs, setChatLogs] = useState([{ user: 'ExampleUser', message: 'Example Message' },]);
    const [currentMessage, setCurrentMessage] = useState('');

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

    //User has enabled video, but not made answer
    useEffect(()=>{
        const addOfferAndCreateAnswerAsync = async()=>{
            //add the offer
            await peerConnection.setRemoteDescription(offerData.offer)
            console.log(peerConnection.signalingState) //have remote-offer
            //now that we have the offer set, make our answer
            console.log("Creating answer...")
            const answer = await peerConnection.createAnswer()
            peerConnection.setLocalDescription(answer)
            const copyOfferData = {...offerData}
            copyOfferData.answer = answer
            copyOfferData.answerUserName = userName
            const socket = socketConnection(userName)
            const offerIceCandidates = await socket.emitWithAck(
                'newAnswer',copyOfferData)
            offerIceCandidates.forEach(c=>{
                peerConnection.addIceCandidate(c)
                console.log("==Added ice candidate from offerer==")
            })
        }

        if(!answerCreated && callStatus.videoEnabled){
            addOfferAndCreateAnswerAsync()
        }
    },[callStatus.videoEnabled,answerCreated])

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
    
    //
    const shareVideo = async()=>{

    }

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

export default AnswerVideo
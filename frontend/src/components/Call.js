// src/components/Call.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './Call.css';
import io from 'socket.io-client';

const Call = () => {
  const { user } = useUser();
  const localVidRef = useRef(null);
  const remoteVidRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCourse = location.state?.selectedCourse;

  const socket = io.connect('https://localhost:3000/', {
    auth: {
      username: user?.username || 'guest',
      password: 'softwaredesign',
    },
  });

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [chatLogs, setChatLogs] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const cleanup = () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        console.log('Camera stream stopped.');
      }
      if (peerConnection) {
        peerConnection.close();
        console.log('Peer connection closed.');
      }
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('pagehide', cleanup);
    };
  }, [localStream, peerConnection]);

  const startCall = async () => {
    try {
      setIsSearching(true);
      console.log(`Starting call for class: ${selectedCourse}`);
      socket.emit('startCall', selectedCourse);

      socket.on('searchingForMatch', (data) => {
        console.log(data.message);
      });

      socket.on('matchFound', async ({ peerSocketId }) => {
        console.log(`Match found with peer: ${peerSocketId}`);
        setIsSearching(false);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVidRef.current.srcObject = stream;
        setLocalStream(stream);

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setPeerConnection(pc);

        pc.ontrack = (event) => {
          console.log('Received remote track');
          if (remoteVidRef.current) {
            remoteVidRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log('Sending ICE candidate');
            socket.emit('sendIceCandidateToSignalingServer', {
              iceCandidate: event.candidate,
              iceUserName: user?.username || 'guest',
              amICaller: true,
            });
          }
        };

        if (user?.username !== peerSocketId) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log('Created and set local offer');
          socket.emit('newOffer', { offer, peerSocketId });
        }

        socket.on('newOffer', async (offerObj) => {
          console.log('Received new offer');
          if (offerObj && offerObj.offer && offerObj.offer.type && offerObj.offer.sdp) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(offerObj.offer));
              console.log('Set remote description with the offer');
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              console.log('Created and set local answer');
              socket.emit('newAnswer', { answer, peerSocketId });
            } catch (error) {
              console.error('Error setting remote description with the offer:', error);
            }
          } else {
            console.error('Invalid or incomplete offer object received');
          }
        });

        socket.on('answerResponse', async (answerObj) => {
          console.log('Received answer from server');
          if (answerObj && answerObj.answer && answerObj.answer.type && answerObj.answer.sdp) {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(answerObj.answer));
              console.log('Set remote description with the answer');
            } catch (error) {
              console.error('Error setting remote description with the answer:', error);
            }
          } else {
            console.error('Invalid or incomplete answer object received');
          }
        });

        socket.on('receivedIceCandidateFromServer', async (candidate) => {
          console.log('Received ICE candidate from server');
          try {
            if (candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
              console.log('Added ICE candidate');
            } else {
              console.error('Received invalid ICE candidate');
            }
          } catch (error) {
            console.error('Error adding received ICE candidate:', error);
          }
        });

        console.log('Call started');
      });
    } catch (error) {
      console.error('Error initializing call:', error);
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    localStream.getAudioTracks().forEach((track) => (track.enabled = !isMicOn));
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    localStream.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn));
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      console.log('Peer connection closed.');
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      console.log('Local stream stopped.');
    }
    navigate('/'); // Navigate back to the home page
  };

  const sendMessage = () => {
    if (currentMessage.trim() === '') return;
    setChatLogs([...chatLogs, { user: user?.username || 'You', message: currentMessage }]);
    setCurrentMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  if (!selectedCourse) {
    return <div>Please select a course from the homepage.</div>;
  }

  return (
    <div className="call-container">
      <div className="main-section">
        <div className="video-section">
          <div className="video-box" id="answerer">
            <video ref={localVidRef} autoPlay muted playsInline className="video-element"></video>
            <div className="label">Your Camera</div>
          </div>
          <div className="video-box" id="caller">
            <video ref={remoteVidRef} autoPlay playsInline className="video-element"></video>
            <div className="label">Remote Camera</div>
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
          <button onClick={sendMessage} className="send-button">Send</button>
        </div>
      </div>

      <div className="controls">
        <button onClick={startCall} className="control-button">Start Call</button>
        <button onClick={toggleMic} className="control-button">{isMicOn ? 'Mic On' : 'Mic Off'}</button>
        <button onClick={toggleCamera} className="control-button">{isCameraOn ? 'Camera On' : 'Camera Off'}</button>
        <button onClick={endCall} className="control-button end-call"><Link to="/">End Call</Link></button>
      </div>
    </div>
  );
};

export default Call;

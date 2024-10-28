import React, {useRef, useEffect} from 'react';
import './toIntegrate.css';

const setVideoReferences = ({localStream, remoteStream}) => {
    const localVidRef = useRef(null);
    const remoteVidRef = useRef(null);

    useEffect(() => {
        if (localVidRef.current) {
            localVidRef.current = localStream;
        }

        if (remoteVidRef.current) {
            remoteVidRef.current = remoteStream;
        }

    }, [localStream, remoteStream]);

    // chatgpt example react code to tie variables with buttons
    return (
        <div className="video-call-container">
        <div className="video-box">
            <h2>Your Video</h2>
            <video ref={localVidRef} autoPlay muted className="video" />
        </div>
        <div className="video-box">
            <h2>User's Video</h2>
            <video ref={remoteVidRef} autoPlay className="video" />
        </div>
        <button className="call-button" onClick={onCall}>
            Start Call {/* needs to be integrated to start call processes */}
        </button> 
        </div>
    );
};

export default setVideoReferences;

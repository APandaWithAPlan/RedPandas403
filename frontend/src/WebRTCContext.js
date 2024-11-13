// src/WebRTCContext.js
import React, { createContext, useState } from 'react';

export const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
  const [callStatus, setCallStatus] = useState({ haveMedia: false });
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [offerData, setOfferData] = useState(null);
  const [userName, setUserName] = useState('');
  const [typeOfCall, setTypeOfCall] = useState();
  const [joined, setJoined] = useState(false);
  const [availableCalls, setAvailableCalls] = useState([]);

  const updateCallStatus = (newStatus) =>
    setCallStatus((prevStatus) => ({ ...prevStatus, ...newStatus }));

  return (
    <WebRTCContext.Provider
      value={{
        callStatus,
        setCallStatus,
        localStream,
        setLocalStream,
        remoteStream,
        setRemoteStream,
        peerConnection,
        setPeerConnection,
        offerData,
        setOfferData,
        userName,
        setUserName,
        typeOfCall,
        setTypeOfCall,
        joined,
        setJoined,
        availableCalls,
        setAvailableCalls,
        updateCallStatus,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

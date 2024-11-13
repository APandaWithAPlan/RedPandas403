// src/App.js
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import Homepage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';
import Forum from './components/Forum';
import Profile from './components/Profile';
import QuestionPage from './components/QuestionPage';
import AdminDashboard from './components/AdminDashboard';
import Call from './components/Call';
import Answer from './components/Answer';

function App() {
    // webRTC states
    const [ callStatus, updateCallStatus ] = useState({})
    const [ localStream, setLocalStream ] = useState(null)
    const [ remoteStream, setRemoteStream ] = useState(null)
    const [ peerConnection, setPeerConnection ] = useState(null)
    const [ offerData, setOfferData ] = useState(null)
    const [ userName, setUserName ] = useState('')

    return (
    <MantineProvider
      theme={{
        colorScheme: 'dark', // Set the color scheme to dark to match your app
        colors: {
          // Customize your red color scale to match your styles
          red: [
            '#fff5f5',
            '#ffe3e3',
            '#ffc9c9',
            '#ff9999',
            '#ff7b7b',
            '#ff4d4d',
            '#ff1a1a',
            '#e60000', // Custom dark reds
            '#cc0000',
            '#b30000',
          ],
        },
        primaryColor: 'red', // Set red as the primary color
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={
                <Homepage
                    callStatus={callStatus}
                    updateCallStatus={updateCallStatus}
                    localStream={localStream}
                    setLocalStream={setLocalStream}
                    remoteStream={remoteStream}
                    setRemoteStream={setRemoteStream}
                    peerConnection={peerConnection}
                    setPeerConnection={setPeerConnection}
                    offerData={offerData}
                    setOfferData={setOfferData}
                    userName={userName}
                    setUserName={setUserName} 
                    /> 
                }/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/question/:id" element={<QuestionPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/offer" element={
                <Call 
                    callStatus={callStatus} 
                    updateCallStatus={updateCallStatus} 
                    localStream={localStream}
                    setLocalStream={setLocalStream}
                    remoteStream={remoteStream}
                    setRemoteStream={setRemoteStream}  
                    peerConnection={peerConnection}
                    userName={userName}
                    setUserName={setUserName}
                    />
                }/>
            <Route path="/answer" element={
                <Answer 
                    callStatus={callStatus} 
                    updateCallStatus={updateCallStatus} 
                    localStream={localStream}
                    setLocalStream={setLocalStream}
                    remoteStream={remoteStream}
                    setRemoteStream={setRemoteStream}               
                    peerConnection={peerConnection}
                    userName={userName}
                    setUserName={setUserName}
                    offerData={offerData}
                    /> 
                }/>
          </Routes>
        </Router>
      </UserProvider>
    </MantineProvider>
  );
}

export default App;

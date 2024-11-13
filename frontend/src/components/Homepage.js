// src/components/Homepage.js
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import {
  Navbar,
  Group,
  Button,
  Menu,
  Text,
  UnstyledButton,
  ThemeIcon,
  Title,
  Accordion,
  Stack,
  Container,
  Center,
  Paper,
} from '@mantine/core';
import {
  IconMessageCircle,
  IconReceipt2,
  IconFingerprint,
  IconLogout,
  IconSettings,
  IconLogin,
  IconUserPlus,
} from '@tabler/icons-react';
import { useUser } from './UserContext';
import './Homepage.css';
import pandaprofLogo from './pandaprof.png'; // Import the logo image
import { socketConnection, fetchUserMedia, createPeerConnection } from './connectionSetup.js';
import { clientSocketListeners } from './emitAnswers.js';

const Homepage = ({callStatus, updateCallStatus, localStream, 
  setLocalStream, remoteStream, setRemoteStream, peerConnection, 
  setPeerConnection, offerData, setOfferData, userName, setUserName}) => {

  // webRTC tracking states
  const [ typeOfCall, setTypeOfCall ] = useState()
  const [joined, setJoined] = useState(false)
  const [availableCalls, setAvailableCalls] = useState([])
  const navigate = useNavigate();  

  const { user, logout } = useUser();
  const [selectedCourse, setSelectedCourse] = useState(null);

  // starts after user clicks the button "join"
  useEffect(()=>{
    if(joined){
        const userName = prompt("Enter username")
        setUserName(userName)
        console.log("Username successfully set")
        const setCalls = data=>{
            setAvailableCalls(data)
            console.log(data)
        }
        const socket = socketConnection(userName)
        socket.on('availableOffers',setCalls)
        socket.on('newOfferAwaiting',setCalls)
    }
  },[joined])

  // runs once initCall returns the promise for user media
  useEffect(()=>{
    if(callStatus.haveMedia && !peerConnection){
        // we have media, now we need a connection
        console.log("We have media, but not a peer connection. Let's create one (homepage.js)")
        const { peerConnection, remoteStream } = createPeerConnection(userName,typeOfCall)
        setPeerConnection(peerConnection)
        setRemoteStream(remoteStream)
        console.log("Remote stream is set, and the peer connection is set")
    }
  },[callStatus.haveMedia])

  // now that we have peerConnection variables and remoteStream variables, let's wait for ice 
  // candidates and offers to come in. We'll handle them here
  useEffect(()=>{
    if(typeOfCall && peerConnection){
        console.log("We have values for typeOfCall and peerConnection. Building socketConnection now.")
        const socket = socketConnection(userName)
        clientSocketListeners(socket,typeOfCall,callStatus, updateCallStatus,peerConnection)
    }
  },[typeOfCall,peerConnection])

  // we have the completed offer and ice candidate. Let's jump to another page
  useEffect(()=>{
    if(remoteStream && peerConnection){
        console.log(`Starting call for class: ${selectedCourse}`);
        navigate(`/${typeOfCall}`, { state: { selectedCourse } });
    }
  },[remoteStream,peerConnection])

  // gets the user media
  const initCall = async(typeOfCall) => {
    await fetchUserMedia(callStatus, updateCallStatus, setLocalStream)
    console.log("Returned promise successfully in initCall (homepage.js)")
    setTypeOfCall(typeOfCall)
  }

  const call = async()=>{
    //call related stuff goes here
    if (!joined) {
        setJoined(true);
        console.log("Joined was set to 'true' ")
    }
    initCall('offer');
    console.log("Starting initCall (homepage.js) ")
  }

  const answer = (callData)=>{
    //answer related stuff goes here
    initCall('answer')
    setOfferData(callData)
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /*const handleStartCall = () => {
    console.log(`Starting call for class: ${selectedCourse}`);
    navigate(`/call`, { state: { selectedCourse } });
    }; */

  // Define subjects and courses
  const subjects = [
    {
      name: 'Math',
      courses: ['Precalculus', 'Calculus One', 'Calculus Two'],
    },
    {
      name: 'Computer Science',
      courses: ['CSC 132', 'CSC 220', 'CSC 325'],
    },
    {
      name: 'Physics',
      courses: ['PHYS 201', 'PHYS 202', 'PHYS 208', 'PHYS 209'],
    },
  ];

  // Navbar links data
  const data = [
    { link: '/forum', label: 'Forum', icon: IconMessageCircle },
    { link: '/billing', label: 'Feature1', icon: IconReceipt2 },
    { link: '/security', label: 'Feature2', icon: IconFingerprint },
  ];

  // Navbar links
  const links = data.map((item) => (
    <UnstyledButton
      key={item.label}
      onClick={() => navigate(item.link)}
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        color: theme.colors.gray[4],
        '&:hover': {
          backgroundColor: theme.colors.red[7],
          color: theme.white,
        },
      })}
    >
      <ThemeIcon variant="light" color="red" size="lg">
        <item.icon size={20} />
      </ThemeIcon>
      <Text size="sm" ml="md">
        {item.label}
      </Text>
    </UnstyledButton>
  ));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1d1d1d' }}>
      {/* Navbar Section */}
      <Navbar width={{ base: 300 }} p="md" sx={{ backgroundColor: '#2c2c2c' }}>
        <Navbar.Section>
          <Group position="apart">
            {/* Logo and Title */}
            <Group>
              <img src={pandaprofLogo} alt="Panda Professor Logo" width={30} height={30} />
              <Title order={3} color="white">
                Panda Professor
              </Title>
            </Group>
          </Group>
        </Navbar.Section>

        <Navbar.Section grow mt="lg">
          {links}
        </Navbar.Section>

        {/* Settings and Logout Section */}
        <Navbar.Section>
          {user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton
                  sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: theme.spacing.sm,
                    borderRadius: theme.radius.sm,
                    color: theme.colors.gray[4],
                    '&:hover': {
                      backgroundColor: theme.colors.red[7],
                      color: theme.white,
                    },
                  })}
                >
                  <ThemeIcon variant="light" color="red" size="lg">
                    <IconSettings size={20} />
                  </ThemeIcon>
                  <Text size="sm" ml="md">
                    Settings
                  </Text>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => navigate('/profile')}>View Profile</Menu.Item>
                <Menu.Item onClick={() => navigate('/admin')}>Admin Dashboard</Menu.Item>
                <Menu.Item onClick={handleLogout} color="red" icon={<IconLogout size={16} />}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Navbar.Section>

        {/* Login and Signup Buttons */}
        {!user && (
          <Navbar.Section mt="lg">
            <Button
              fullWidth
              variant="outline"
              color="red"
              leftIcon={<IconLogin size={20} />}
              onClick={() => navigate('/login')}
              sx={{ marginBottom: '8px' }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="filled"
              color="red"
              leftIcon={<IconUserPlus size={20} />}
              onClick={() => navigate('/signup')}
            >
              Signup
            </Button>
          </Navbar.Section>
        )}
      </Navbar>

      {/* Main Content Section */}
      <Container
        className="content-area"
        p="md"
        size="lg"
        style={{ flex: 1, backgroundColor: '#1d1d1d', color: 'white' }}
      >
        {user ? (
          <Paper
            shadow="md"
            radius="md"
            p="xl"
            withBorder
            style={{ backgroundColor: '#2c2c2c', color: 'white' }}
          >
            <Title order={2} align="center" color="red" mb="md">
              Select a Subject
            </Title>
            <Accordion
              multiple
              variant="separated"
              sx={{ maxWidth: 600, margin: '0 auto' }}
            >
              {subjects.map((subject) => (
                <Accordion.Item value={subject.name} key={subject.name}>
                  <Accordion.Control
                    style={{
                      backgroundColor: '#1d1d1d', // Same as main content background
                      color: 'white',
                    }}
                  >
                    {subject.name}
                  </Accordion.Control>
                  <Accordion.Panel style={{ backgroundColor: '#1d1d1d' }}>
                    <Stack>
                      {subject.courses.map((course) => (
                        <Button
                          key={course}
                          variant="filled"
                          color="red"
                          fullWidth
                          onClick={() => setSelectedCourse(course)}
                          style={{
                            color: 'white',
                          }}
                        >
                          {course}
                        </Button>
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>

            {selectedCourse && (
              <Center mt="xl">
                <Title order={3} align="center" mt="md">
                  Selected Class: {selectedCourse}
                </Title>
                <Button mt="md" color="red" onClick={call} fullWidth>
                  Start Call
                </Button>
              </Center>
            )}
              <Center mt="xl">
                <Title order={3} align="center" mt="md">
                  Available Calls
                </Title>
                {availableCalls.map((callData, i) => (
                    <Button
                        key={i}
                        mt="md"
                        color="yellow"
                        onClick={() => answer(callData)}
                        fullWidth
                    >
                    Answer Call From {callData.offererUserName}
                    </Button>
                ))}
</Center>
          </Paper>
        ) : (
          <Paper
            shadow="md"
            radius="md"
            p="xl"
            withBorder
            style={{ backgroundColor: '#2c2c2c', color: 'white' }} // Match navbar color
          >
            <Center>
              <Title order={2} align="center" color="red" mb="md">
                Get Started with Panda Professor!
              </Title>
            </Center>
            <Text align="center" mt="md">
              Explore tutor experts and other educational features. Sign up now and become part
              of our community!
            </Text>
            <Center mt="lg">
              <Button component={Link} to="/signup" color="red" size="lg">
                Get Started
              </Button>
            </Center>
          </Paper>
        )}
      </Container>
    </div>
  );
}

export default Homepage;

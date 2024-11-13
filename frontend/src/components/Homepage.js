// src/components/Homepage.js
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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
  TextInput,
  Notification,
  Textarea
} from '@mantine/core';
import {
  IconMessageCircle,
  IconReceipt2,
  IconFingerprint,
  IconLogout,
  IconSettings,
  IconLogin,
  IconUserPlus,
  IconNotes,
  IconQuestionMark
} from '@tabler/icons-react';
import { useUser } from './UserContext';
import './Homepage.css';
import pandaprofLogo from './pandaprof.png';

function Homepage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showSuggestSubject, setShowSuggestSubject] = useState(false);
  const [suggestedSubject, setSuggestedSubject] = useState('');
  const [notification, setNotification] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartCall = () => {
    console.log(`Starting call for class: ${selectedCourse}`);
    navigate(`/call`, { state: { selectedCourse } });
  };

  const handleSuggestSubjectSubmit = () => {
    if (suggestedSubject.trim() === '') {
      alert('Please enter a subject.');
      return;
    }
    // Here you can send the suggested subject to the backend or handle it as needed
    // just display a notification for now
    // Joseph or Nick this will be where your backend integration stuff
    // Going to need to put the logic in Forum as well
    setNotification(`Thank you for suggesting: ${suggestedSubject}`);
    setSuggestedSubject('');
    setShowSuggestSubject(false);
  };

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
    /*{ link: '/billing', label: 'Feature1', icon: IconReceipt2 },
    { link: '/security', label: 'Feature2', icon: IconFingerprint },*/
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
              <img
                src={pandaprofLogo}
                alt="Panda Professor Logo"
                width={30}
                height={30}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              />
              <Title order={3} color="white" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                Panda Professor
              </Title>
            </Group>
          </Group>
        </Navbar.Section>

        <Navbar.Section grow mt="lg">
          {links}

          {/* Missing Subject Button */}
          <UnstyledButton
            onClick={() => setShowSuggestSubject(!showSuggestSubject)}
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
              <IconQuestionMark size={20} />
            </ThemeIcon>
            <Text size="sm" ml="md">
              New Subject Submission
            </Text>
          </UnstyledButton>

          {/* Suggest Subject Form */}
          {showSuggestSubject && (
            <Stack spacing="sm" mt="sm">
              <Textarea
                placeholder="Suggest a subject . . . "
                value={suggestedSubject}
                onChange={(e) => setSuggestedSubject(e.target.value)}
                autosize
                minRows={3}
                maxRows={6}
                sx={{
                  textarea: {
                    backgroundColor: '#1d1d1d',
                    color: 'white',
                    borderColor: '#555',
                  },
                }}
              />
              <Button color="red" onClick={handleSuggestSubjectSubmit}>
                Submit
              </Button>
            </Stack>
          )}
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
        {notification && (
          <Notification
            color="red"
            title="Thank you!"
            onClose={() => setNotification(null)}
            sx={{ position: 'fixed', top: 20, right: 20 }}
          >
            {notification}
          </Notification>
        )}

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
            <Accordion multiple variant="separated" sx={{ maxWidth: 600, margin: '0 auto' }}>
              {subjects.map((subject) => (
                <Accordion.Item value={subject.name} key={subject.name}>
                  <Accordion.Control
                    style={{
                      backgroundColor: '#1d1d1d',
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
              <Center mt="xl" style={{ flexDirection: 'column' }}>
                <Title order={3} align="center" mt="md">
                  Selected Class: {selectedCourse}
                </Title>
                <Button mt="md" color="red" onClick={handleStartCall} fullWidth>
                  Start Call
                </Button>
              </Center>
            )}
          </Paper>
        ) : (
          <Paper
            shadow="md"
            radius="md"
            p="xl"
            withBorder
            style={{ backgroundColor: '#2c2c2c', color: 'white' }}
          >
            <Center>
              <Title order={2} align="center" color="red" mb="md">
                Get Started with Panda Professor!
              </Title>
            </Center>
            <Text align="center" mt="md">
              Explore tutor experts and other educational features. Sign up now and become part of
              our community!
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

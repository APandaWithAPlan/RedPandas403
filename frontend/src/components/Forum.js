import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from './UserContext';
import {
  Container,
  TextInput,
  Button,
  Paper,
  Title,
  Group,
  Navbar,
  Text,
  Stack,
  FileInput,
  Textarea,
  Anchor,
  Notification,
  Card,
  ThemeIcon,
  ScrollArea,
  Menu,
  UnstyledButton,
} from '@mantine/core';
import {
  IconSearch,
  IconUpload,
  IconSend,
  IconMessageCircle,
  IconReceipt2,
  IconFingerprint,
  IconLogout,
  IconSettings,
  IconLogin,
  IconUserPlus,
} from '@tabler/icons-react';
import pandaprofLogo from './pandaprof.png';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Forum() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [qaData, setQaData] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');
      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQaData(data);
      }
    };
    fetchQuestions();
  }, []);

  // Load MathJax script
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=AM_CHTML';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = qaData.filter((qa) =>
      qa.question.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setSearchSubmitted(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = qaData.filter((qa) =>
      qa.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setSearchSubmitted(true);
    setSearchTerm('');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit a question.');
      return navigate('/login');
    }

    const { error } = await supabase.from('questions').insert([
      {
        question,
        user_id: user.id,
        image_url: image ? await uploadImage(image) : null,
      },
    ]);

    if (error) {
      console.error('Error submitting question:', error);
    } else {
      alert('Question submitted successfully!');
      setQuestion('');
      setImage(null);
      setQaData((prev) => [...prev, { question, user_id: user.id }]);
    }
  };

  const uploadImage = async (file) => {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`public/${file.name}`, file);
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    return data.Key;
  };

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

  // MathJaxContent component
  function MathJaxContent({ content }) {
    useEffect(() => {
      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
      }
    }, [content]);

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#1d1d1d',
        color: 'white',
      }}
    >
      {/* Navbar Section */}
      <Navbar width={{ base: 250 }} p="md" sx={{ backgroundColor: '#2c2c2c' }}>
        <Navbar.Section>
          <Group position="apart">
            <Group>
              <img
                src={pandaprofLogo}
                alt="Panda Professor Logo"
                width={30}
                height={30}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              />
              <Title
                order={3}
                color="white"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              >
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
                <Menu.Item onClick={() => navigate('/profile')}>
                  View Profile
                </Menu.Item>
                <Menu.Item onClick={() => navigate('/admin')}>
                  Admin Dashboard
                </Menu.Item>
                <Menu.Item
                  onClick={handleLogout}
                  color="red"
                  icon={<IconLogout size={16} />}
                >
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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          width: '100%',
          padding: '20px',
          gap: '20px',
          backgroundColor: '#1d1d1d',
          alignItems: 'flex-start',
          margin: '0 auto',
        }}
      >
        {/* Center Section for Search and Questions */}
        <div
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Search Bar */}
          <Group position="center" mb="lg">
            <form
              onSubmit={handleSearchSubmit}
              style={{ display: 'flex', width: '100%' }}
            >
              <TextInput
                placeholder="Search for questions..."
                value={searchTerm}
                onChange={handleSearchChange}
                rightSection={<IconSearch size={16} />}
                style={{ flexGrow: 1, marginRight: 10 }}
              />
              <Button type="submit" color="red">
                Search
              </Button>
            </form>
          </Group>

          {/* Questions List */}
          <Title order={3} color="red" mt="xl">
            Questions
          </Title>
          <ScrollArea
            style={{ height: 'calc(100vh - 195px)', overflowY: 'auto' }}
          >
            <Stack spacing="md">
              {(
                searchSubmitted && filteredQuestions.length > 0
                  ? filteredQuestions
                  : qaData
              ).map((qa) => (
                <Card
                  key={qa.id}
                  withBorder
                  shadow="md"
                  radius="md"
                  style={{
                    backgroundColor: '#2c2c2c',
                    color: 'white',
                    maxWidth: '98%',
                  }}
                >
                  <Group position="apart">
                    <MathJaxContent content={`Q: ${qa.question}`} />
                    <Anchor
                      component={Link}
                      to={`/question/${qa.id}`}
                      color="red"
                    >
                      View answer
                    </Anchor>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        </div>

        {/* Submit a Question Section on the Right Side */}
        <Paper
          withBorder
          shadow="md"
          p="xl"
          radius="md"
          style={{
            flex: 1,
            backgroundColor: '#2c2c2c',
            color: 'white',
            marginTop: '20px',
            marginLeft: '15px',
          }}
        >
          <Title order={2} color="red" align="center">
            Submit a New Question
          </Title>
          {user ? (
            <form onSubmit={handleQuestionSubmit}>
              <Stack spacing="md" mt="lg">
                <Textarea
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                  label="Question"
                  radius="md"
                  styles={{
                    input: { backgroundColor: '#1d1d1d', color: 'white' },
                  }}
                />
                <FileInput
                  placeholder="Upload an image (optional)"
                  icon={<IconUpload size={16} />}
                  onChange={(file) => setImage(file)}
                  label="Image"
                  accept="image/*"
                  radius="md"
                  styles={{
                    input: { backgroundColor: '#1d1d1d', color: 'white' },
                  }}
                />
                <Button
                  type="submit"
                  color="red"
                  leftIcon={<IconSend size={16} />}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          ) : (
            <Notification color="red" title="Login required">
              You must be logged in to submit a question. Please{' '}
              <Anchor component={Link} to="/login">
                log in
              </Anchor>
              .
            </Notification>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Forum;

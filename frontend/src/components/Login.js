// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { useUser } from './UserContext';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Notification,
  Stack,
  Group,
  Center,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Fetch the user by username
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        setErrorMessage('User not found');
        return;
      }

      // Compare entered password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        setErrorMessage('Incorrect password');
        return;
      }

      // Check if user is verified before logging in
      if (!user.verified) {
        setErrorMessage('User not verified. Please check your email for verification link.');
        return;
      }

      // Store user data in context and navigate to homepage
      login(user);
      setErrorMessage('');
      navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Paper
        radius="md"
        p="xl"
        withBorder
        shadow="lg"
        style={{ maxWidth: 400, width: '100%', backgroundColor: '#2c2c2c' }}
      >
        <Title align="center" mb="md" color="red">
          Login
        </Title>

        {errorMessage && (
          <Notification
            icon={<IconAlertCircle size={18} />}
            color="red"
            disallowClose
            mb="md"
          >
            {errorMessage}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing="sm">
            <TextInput
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" color="red" fullWidth loading={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Stack>
        </form>

        <Group position="center" mt="md">
          <Text size="sm" color="dimmed">
            Don't have an account?{' '}
            <Text
              component={Link}
              to="/signup"
              color="red"
              underline
            >
              Register here!
            </Text>
          </Text>
        </Group>
      </Paper>
    </Center>
  );
}

export default Login;

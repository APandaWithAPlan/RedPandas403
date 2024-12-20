// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Notification,
  Radio,
  Stack,
  Group,
  Center,
  FileInput,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconUpload } from '@tabler/icons-react';

// Temporarily hardcoded Supabase credentials
const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!role) {
      setErrorMessage('Please select whether you are a tutor or a student.');
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = uuidv4();
      const isTutor = role === 'tutor';

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password: hashedPassword,
            verified: false,
            verification_token: verificationToken,
            is_tutor: isTutor,
          },
        ])
        .select();

      if (userError || !userData || userData.length === 0) {
        setErrorMessage(userError.message || 'Account creation failed.');
      } else {
        const userId = userData[0].id;

        // If tutor and file exists, upload the file to the bucket and save metadata
        if (isTutor && file) {
          const { data: fileData, error: fileError } = await supabase.storage
            .from('tutor_documents')
            .upload(`documents/${userId}/${file.name}`, file);

          if (fileError) {
            console.error('Error uploading file:', fileError);
            setErrorMessage('Failed to upload file.');
          } else {
            // Save document metadata
            const documentUrl = fileData.path;
            await supabase.from('tutor_documents').insert([
              { user_id: userId, document_url: documentUrl }
            ]);
          }
        }

        await sendVerificationEmail(email, verificationToken);
        setSuccessMessage('Account created! Please check your email to verify your account.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      console.error('Error during account creation:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (email, token) => {
    try {
      const response = await fetch('/api/sendVerificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverEmail: email, verificationToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to send verification email');
      }

      console.log('Verification email sent');
    } catch (error) {
      console.error('Error in sendVerificationEmail:', error.message);
      setErrorMessage('Failed to send verification email.');
    }
  };

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Paper
        radius="md"
        p="xl"
        withBorder
        shadow="lg"
        style={{ maxWidth: 500, width: '100%', backgroundColor: '#2c2c2c' }}
      >
        <Title align="center" mb="md" color="red">
          Signup
        </Title>

        {errorMessage && (
          <Notification icon={<IconAlertCircle size={18} />} color="red" disallowClose mb="md">
            {errorMessage}
          </Notification>
        )}

        {successMessage && (
          <Notification icon={<IconCheck size={18} />} color="green" disallowClose mb="md">
            {successMessage}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing="sm">
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <TextInput
              label="Username"
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <TextInput
              label="Student Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <PasswordInput
              label="Re-enter Password"
              placeholder="Re-enter your password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
            />

            <Radio.Group
              label="Role"
              value={role}
              onChange={setRole}
              required
            >
              <Radio value="student" label="Student" />
              <Radio value="tutor" label="Tutor" />
            </Radio.Group>

            {/* File Upload for Tutors */}
            {role === 'tutor' && (
              <FileInput
                placeholder="Upload your credentials"
                icon={<IconUpload size={16} />}
                onChange={(file) => setFile(file)}
                label="Credentials File"
                accept=".pdf,.doc,.docx,.jpg,.png"
                required
              />
            )}

            <Button type="submit" color="red" fullWidth loading={loading}>
              {loading ? 'Creating...' : 'Signup'}
            </Button>
          </Stack>
        </form>

        <Group position="center" mt="md">
          <Text size="sm" color="dimmed">
            Already have an account?{' '}
            <Text component={Link} to="/login" color="red" underline>
              Login
            </Text>
          </Text>
        </Group>
      </Paper>
    </Center>
  );
};

export default Signup;

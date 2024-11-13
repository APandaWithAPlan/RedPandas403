// src/components/Profile.js
import React, { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import './Profile.css';
import { Modal, TextInput, Button, Text, Paper, Title, Notification, Group } from '@mantine/core';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Profile = () => {
  const { user, logout, setUser } = useUser();
  const navigate = useNavigate();

  const [modalOpened, setModalOpened] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newInput, setNewInput] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  const updateUser = async (field, value) => {
    if (!user) return;

    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);

    const { error } = await supabase
      .from('users')
      .update({ [field]: value })
      .eq('id', user.id);

    if (error) {
      setUser(user);
      setNotification({ type: 'error', message: `Failed to update ${field}.` });
    } else {
      setNotification({ type: 'success', message: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!` });
    }
  };

  const handleModalSubmit = () => {
    if (modalType === 'password') {
      changePassword(newInput);
    } else {
      updateUser(modalType, newInput);
    }
    setModalOpened(false);
    setNewInput('');
  };

  const changePassword = async (newPassword) => {
    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateUser('password', hashedPassword);
    }
  };

  const resendVerificationEmail = async () => {
    if (user?.email) {
      try {
        const response = await fetch('/api/sendVerificationEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverEmail: user.email,
            verificationToken: user.verification_token,
          }),
        });

        if (response.ok) {
          setNotification({ type: 'success', message: 'Verification email resent successfully' });
        } else {
          throw new Error('Failed to resend verification email');
        }
      } catch (error) {
        setNotification({ type: 'error', message: error.message });
      }
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpened(true);
  };

  return (
    <Paper radius="md" p="xl" withBorder shadow="lg" className="profile-page">
      <Title align="center" mb="md" color="red">
        Profile
      </Title>

      {notification.message && (
        <Notification
          icon={notification.type === 'success' ? <IconCheck size={18} /> : <IconAlertCircle size={18} />}
          color={notification.type === 'success' ? 'green' : 'red'}
          mb="md"
        >
          {notification.message}
        </Notification>
      )}

      {user ? (
        <>
          <Text size="lg">Welcome, {user.first_name}!</Text>
          <Text>Email: {user.email}</Text>
          <Text>Username: {user.username}</Text>

          <Group mt="md" spacing="sm">
            <Button color="red" onClick={() => openModal('username')}>
              Change Username
            </Button>
            <Button color="red" onClick={() => openModal('email')}>
              Change Email
            </Button>
            <Button color="red" onClick={() => openModal('password')}>
              Change Password
            </Button>
            <Button color="red" onClick={resendVerificationEmail}>
              Resend Verification
            </Button>
            <Button color="gray" onClick={logout}>
              Log out
            </Button>
            <Button color="gray" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Group>
        </>
      ) : (
        <Text color="dimmed">You are not logged in.</Text>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={`Change ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
        centered
      >
        <TextInput
          label={`New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
          placeholder={`Enter new ${modalType}`}
          value={newInput}
          onChange={(e) => setNewInput(e.target.value)}
          required
        />
        <Group position="center" mt="md">
          <Button color="red" onClick={handleModalSubmit}>
            Save
          </Button>
        </Group>
      </Modal>
    </Paper>
  );
};

export default Profile;

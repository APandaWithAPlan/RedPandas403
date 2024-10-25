import React, { useState, version } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import './Signup.css';

// Use environment variables for Supabase URL and anon key
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
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

      setLoading(true);

      try {
          const hashedPassword = await bcrypt.hash(password, 10);
          const verificationToken = uuidv4();
          const { error } = await supabase
              .from('users')
              .insert([
                  {
                      first_name: firstName,
                      last_name: lastName,
                      username,
                      email,
                      password: hashedPassword,
                      verified: false,
                      verification_token: verificationToken
                  }
              ]);

          if (error) {
              setErrorMessage(error.message || 'Account creation failed.');
          } else {
                await sendVerificationEmail(email, verificationToken)

                setSuccessMessage('Account created successfully! Please check your email to verify your account.');
                setTimeout(() => navigate('/login'), 3000);
          }
      } catch (error) {
          setErrorMessage('An error occurred. Please try again.');
      } finally {
          setLoading(false);
      }
    };

    const sendVerificationEmail = async (email, token) => {
        const response = await fetch('/api/sendVerificationEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ receiverEmail: email, verificationToken: token }),
        });

        if (!response.ok) {
            throw new Error('Failed to send verification email');
        }

        const data = await response.json();
        console.log(data.message);
    };

  return (
      <div className="signup">
          <h1>Signup</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
              <label htmlFor="firstName">First Name:</label>
              <input 
                  type="text" 
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} 
                  required 
              />
              <label htmlFor="lastName">Last Name:</label>
              <input 
                  type="text" 
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)} 
                  required 
              />
              <label htmlFor="username">Username:</label>
              <input 
                  type="text" 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
              />
              <label htmlFor="email">Student Email:</label>
              <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
              />
              <label htmlFor="password">New Password:</label>
              <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
              />
              <label htmlFor="verifyPassword">Re-enter Password:</label>
              <input 
                  type="password" 
                  id="verifyPassword"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)} 
                  required 
              />
              <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Signup'}</button>
          </form>
          <p>
              Already have an account? <Link to="/login" style={{ color: '#22d81b' }}>Login</Link>
          </p>
      </div>
  );
};

export default Signup;

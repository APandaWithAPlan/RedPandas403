// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import './Signup.css';

// Temporarily hardcoded Supabase credentials
const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co'; // Replace with your actual Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q'; // Replace with your actual Supabase anon key

// Initialize Supabase client with hardcoded values
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
                        verification_token: verificationToken,
                    },
                ]);

            if (error) {
                setErrorMessage(error.message || 'Account creation failed.');
            } else {
                await sendVerificationEmail(email, verificationToken);

                setSuccessMessage('Account created successfully! Please check your email to verify your account.');
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
            console.log("Sending verification email...");
            const response = await fetch('/api/sendVerificationEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiverEmail: email, verificationToken: token }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(' ');
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Error in sendVerificationEmail:', error.message);
            setErrorMessage(' ');
        }
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

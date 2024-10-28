// src/components/EmailVerification.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EmailVerification.css'; // Importing the CSS file

const EmailVerification = () => {
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');

            console.log('Verifying email with token:', token); // Log the token being used

            if (token) {
                try {
                    // Update to the production URL
                    const response = await fetch(`https://www.pandaprofessor.xyz/api/verify?token=${token}`, {
                        method: 'GET', // Use GET method
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    const data = await response.json();
                    console.log('Response from server:', data); // Log the server response
                    
                    if (response.ok) {
                        setMessage('You have successfully verified your account!'); // Updated success message
                        // Redirect to the login page after a short delay
                        setTimeout(() => {
                            navigate('/login'); // Change to your actual login route
                        }, 3000); // 3 seconds delay
                    } else {
                        // Only set this message when the token is invalid
                        setMessage(data.message || 'Invalid or expired token. Please try again.'); // Error message
                    }
                } catch (error) {
                    console.error('Error during email verification:', error);
                    setMessage(`An error occurred. Please try again. 2: ${JSON.stringify(error)}`); // General error message
                }
            } else {
                setMessage('No verification token provided.'); // No token case
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div className="verification-container">
            <h1>Email Verification</h1>
            <p className="verification-message">{message}</p>
        </div>
    );
};

export default EmailVerification;

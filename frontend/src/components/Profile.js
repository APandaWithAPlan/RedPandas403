// src/components/Profile.js
import React from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import './Profile.css';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
  );
  

const Profile = () => {
    const { user, login, logout, setUser } = useUser(); // Access setUser from context
    const navigate = useNavigate();
    const [lastResendTime, setLastResendTime] = useState(null); // Stores last resend timestamp
    const cooldownTime = 5 * 60 * 1000;
    const changeUsername = async (newUsername) => {
        if (user) {
            // update the UI
            setUser({ ...user, username: newUsername });

            // Update the username in the database
            const { error } = await supabase
                .from('users')
                .update({ username: newUsername })
                .eq('id', user.id);

            if (error) {
                console.error('Error updating username:', error);
                // revert the optimistic UI change if the update fails
                setUser({ ...user, username: user.username });
            } else {
                console.log('Username successfully updated in database');
            }
        }
    };

    const changeEmail = async (newEmail) => {
        if (user) {
            // update the UI
            setUser({ ...user, email: newEmail });

            // Update the email in the database
            const { error } = await supabase
                .from('users')
                .update({ email: newEmail })
                .eq('id', user.id);

            if (error) {
                console.error('Error updating email:', error);
                // revert the optimistic UI change if the update fails
                setUser({ ...user, email: user.email });
            } else {
                console.log('Email successfully updated in database');
            }
        }
    }

    const changePassword = async (newPassword) => {
        if (user) {
            //hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update the password in the database
            const { error } = await supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', user.id);

            if (error) {
                console.error('Error updating password:', error);
                // revert the optimistic UI change if the update fails
                setUser({ ...user, password: user.password });
            } else {
                console.log('Password successfully updated in database');
            }
        }
    }

    const resendVerificationEmail = async () => {
        const currentTime = new Date().getTime();
        
        if (lastResendTime && currentTime - lastResendTime < cooldownTime) {
            const waitTime = Math.ceil((cooldownTime - (currentTime - lastResendTime)) / 1000);
            alert(`Please wait ${Math.floor(waitTime / 60)} minutes and ${waitTime % 60} seconds before requesting again.`);
            return;
        }

        if (user && user.email) {
            try {
                const response = await fetch('/api/sendVerificationEmail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        receiverEmail: user.email,
                        verificationToken: user.verification_token // Assuming this is available in `user`
                    }),
                });
    
                if (response.ok) {
                    console.log('Verification email resent successfully');
                    setLastResendTime(currentTime);
                } else {
                    console.error('Failed to resend verification email:', await response.json());
                }
            } catch (error) {
                console.error('Error resending verification email:', error);
            }
        }
    };
    

        
    

    return (
        <div className='profile-page'>
            {user ? (
                <>
                    <h1>Welcome, {user.first_name}!</h1>
                    <p>Email: {user.email}</p>
                    <p>Username: {user.username}</p>

                    <button onClick={() => {
                        const newUsername = prompt("Enter new username:");
                        if (newUsername) {
                            changeUsername(newUsername); // Call the function defined inside this component
                        }
                    }}>
                        Change Username
                    </button>

                    <button onClick={() => {
                        const newEmail = prompt("Enter new email:");
                        if (newEmail) {
                            changeEmail(newEmail); // Call the function defined inside this component
                        }
                    }}>
                        Change Email
                    </button>

                    <button onClick={() => {
                        const newPassword = prompt("Enter new password:");
                        if (newPassword) {
                            changePassword(newPassword); // Call the function defined inside this component
                        }
                    }
                    }>
                        Change Password
                    </button>

                    <button onClick={resendVerificationEmail}>Resend Verification</button>


                    <button onClick={logout}>Log out</button>

                    <button onClick={() => navigate(-1)}>Back</button>
                </>
            ) : 
            
            (
                <>
                You are not logged in.
                
                </>
            )}
        </div>
    );
};

export default Profile;

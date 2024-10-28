// src/components/Profile.js
import React from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import Homepage from './Homepage';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Profile = () => {
    const { user, login, logout, setUser } = useUser(); // Access setUser from context
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
                .update({ password: newPassword })
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

        
    

    return (
        <div>
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


                    <button onClick={logout}>Log out</button>
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

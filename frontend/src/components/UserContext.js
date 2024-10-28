// src/components/UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

// Fixed ChangeUsername function
export const ChangeUsername = (newUsername) => {
    const { user, setUser } = useUser();  // Access user and setUser from context

    if (user) {
        setUser({ ...user, username: newUsername });  // Update the username while keeping the rest of the user data
    }
};

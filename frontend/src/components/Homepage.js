// src/components/Homepage.js
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useUser } from './UserContext';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useUser();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <h1>Panda Professor</h1>
        <div className="nav-links">
          {user ? (
            <div className="profile-dropdown">
              <button onClick={toggleDropdown} className="profile-button">Profile</button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button onClick={() => navigate('/profile')}>View Profile</button>
                  <button onClick={() => navigate('/admin')}>Admin Dashboard</button> {/* Link to Admin Dashboard */}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button><Link to="/signup">Go to Signup</Link></button>
              <button><Link to="/login">Go to Login</Link></button>
            </>
          )}
        </div>
      </nav>
      <div className="content">
        <h2>Get Started with Panda Professor!</h2>
        <p>
          Explore tutor experts and other educational features. 
          Sign up now and become part of our community!
        </p>
        <Link to="/signup">
          <button className="get-started">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default Homepage;

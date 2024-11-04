// src/components/Homepage.js
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useUser } from './UserContext';
import './Homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useUser();
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartCall = () => {
    // Implement call initiation logic
    console.log(`Starting call for class: ${selectedCourse}`);
    // navigate to a call page
    navigate(`/call`,{ state: { selectedCourse: selectedCourse } });
  };

  // courses
  const subjects = [
    {
      name: 'Math',
      courses: ['Precalculus', 'Calculus One', 'Calculus Two'],
    },
    {
      name: 'Computer Science',
      courses: ['CSC 132', 'CSC 220', 'CSC 325'],
    },
  ];

  return (
    <div className="homepage">
      <nav className="navbar">
        <h1>Panda Professor</h1>
        <div className="nav-links">
          <button>
            <Link to="/Forum">Go to Forums</Link>
          </button>
          {user ? (
            <div className="profile-dropdown">
              <button onClick={toggleDropdown} className="profile-button">
                Profile
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button onClick={() => navigate('/profile')}>View Profile</button>
                  <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button>
                <Link to="/signup">Go to Signup</Link>
              </button>
              <button>
                <Link to="/login">Go to Login</Link>
              </button>
            </>
          )}
        </div>
      </nav>
      <div>
        {user ? (
          <div className="subject-selection">
            <h2>Select a Subject</h2>
            {subjects.map((subject) => (
              <div key={subject.name} className="subject">
                <button
                  onClick={() =>
                    setExpandedSubject(
                      expandedSubject === subject.name ? null : subject.name
                    )
                  }
                  className="subject-button"
                >
                  {subject.name}
                </button>
                {expandedSubject === subject.name && (
                  <ul className="course-list">
                    {subject.courses.map((course) => (
                      <li key={course} className="course-item">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className={`course-button ${
                            selectedCourse === course ? 'selected' : ''
                          }`}
                        >
                          {course}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {selectedCourse && (
              <div className="selected-course">
                <h2>Selected Class: {selectedCourse}</h2>
                <button onClick={handleStartCall} className="start-call-button">
                  Start Call
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="content">
            <h2>Get Started with Panda Professor!</h2>
            <p>
              Explore tutor experts and other educational features. Sign up now
              and become part of our community!
            </p>
            <Link to="/signup">
              <button className="get-started">Get Started</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;

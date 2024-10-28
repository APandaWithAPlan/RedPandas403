import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import UserVerification from './UserVerification';
import { useUser } from './UserContext';
import ReportedPosts from './ReportedPosts';
import ReportedUsers from './ReportedUsers';
import { createClient } from '@supabase/supabase-js';
import './AdminDashboard.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);



function AdminDashboard() {
  const navigate = useNavigate(); // Initialize the navigate function
  const { user, login, logout, setUser } = useUser(); // Access setUser from context

  return (
    <div>
      {user && user.is_admin ? (
        
        <div className="admin-dashboard">
        <nav className="sidebar">
          <h2>Admin Settings</h2>
          <button className="back-button" onClick={() => navigate(-1)}>Back</button> {/* Back button */}
          <ul>
            <li><Link to="/admin/user-verification">User Verification Status</Link></li>
            <li><Link to="/admin/reported-posts">Reported Posts</Link></li>
            <li><Link to="/admin/reported-users">Reported Users</Link></li>
          </ul>
        </nav>
  
        <div className="content">
          <Routes>
            <Route path="/user-verification" element={<UserVerification />} />
            <Route path="/reported-posts" element={<ReportedPosts />} />
            <Route path="/reported-users" element={<ReportedUsers />} />
          </Routes>
        </div>
      </div>
      
      ) : (
        navigate('/')
      )}
    </div>
    

  );
}

export default AdminDashboard;

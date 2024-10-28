import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import UserVerification from './UserVerification';
import { useUser } from './UserContext';
import ReportedPosts from './ReportedPosts';
import ReportedUsers from './ReportedUsers';
import { createClient } from '@supabase/supabase-js';
import './AdminDashboard.css';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);



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

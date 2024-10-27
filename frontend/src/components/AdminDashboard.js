import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import UserVerification from './UserVerification';
import ReportedPosts from './ReportedPosts';
import ReportedUsers from './ReportedUsers';
import './AdminDashboard.css'; // Ensure you create this CSS file

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <nav className="sidebar">
        <h2>Admin Settings</h2>
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
  );
}

export default AdminDashboard;

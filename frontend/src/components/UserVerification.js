// src/components/UserVerification.js
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './UserVerification.css';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function UserVerification() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Fetch all users on component load
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, username, verified, is_tutor');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search input
    setFilteredUsers(
      users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, users]);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setVerificationStatus(user.verified);
    setDocuments([]); // Clear previous documents

    console.log("Selected User:", user);  // Debugging: Check selected user info

    // Fetch documents for the selected tutor if they are a tutor
    if (user.is_tutor) {
      const { data, error } = await supabase
        .from('tutor_documents')
        .select('document_url')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data);
        console.log("Documents:", data);  // Debugging: Check retrieved documents
      }
    }
  };

  const handleVerificationChange = async (newStatus) => {
    if (selectedUser) {
      // Update verification status in the database
      const { error } = await supabase
        .from('users')
        .update({ verified: newStatus })
        .eq('id', selectedUser.id);

      if (error) {
        console.error('Error updating verification status:', error);
      } else {
        setVerificationStatus(newStatus);
        // Update local user data to reflect changes
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser.id ? { ...user, verified: newStatus } : user
          )
        );
      }
    }
  };

  return (
    <div className="user-verification">
      <h2>User Verification Status</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {filteredUsers.length > 0 && (
          <div className="dropdown">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`dropdown-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
              >
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="verification-status-container">
          <h3>{selectedUser.username}'s Verification Status</h3>
          <select
            value={verificationStatus}
            onChange={(e) => handleVerificationChange(e.target.value === 'true')}
            className="status-dropdown"
          >
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>

          {/* Display tutor documents if the user is a tutor and has documents */}
          {selectedUser.is_tutor && documents.length > 0 && (
            <div className="document-section">
              <h4>Tutor Documents:</h4>
              <ul>
                {documents.map((doc, index) => (
                  <li key={index}>
                    <a
                      href={`https://ohkvsyqbngdukvqihemh.supabase.co/storage/v1/object/public/tutor_documents/${doc.document_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserVerification;

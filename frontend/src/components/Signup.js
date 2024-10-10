import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  return (
    <div className='background'>
      <div className="signup">
        <h1>Signup</h1>
        <form>
          <div>
            <label htmlFor="First Name">First Name:</label>
            <input type="text" id="FirstName" name="FirstName" required />
          </div>
          <div>
            <label htmlFor="Last Name">Last Name:</label>
            <input type="text" id="LastName" name="LastName" required />
          </div>
          <div>
            <label htmlFor="studentEmail">Student Email:</label>
            <input type="email" id="studentEmail" name="studentEmail" required />
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required />
          </div>
          <div>
            <label htmlFor="Re EnterPassword">Re-enter Password</label>
            <input type="password" id="Re-enterPassword" name="Re-enterPassword" required />
          </div>
          <button type="submit">Signup</button>
        </form>
        <p>
          Already have an account? <Link to="/login" style={{ color: '#22d81b' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

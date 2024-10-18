import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './Forum.css'

function Forum() {
    const [question, setQuestion] = useState('');
    const [image, setImage] = useState(null);

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
      };
    
      const handleImageChange = (e) => {
        setImage(e.target.files[0]);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle submitting the data, such as sending it to a backend API
        console.log('Question:', question);
        console.log('Image:', image);
        // Clear the form
        setQuestion('');
        setImage(null);
      };

  return (
    <div className='forum'>
      <nav className="navbar">
        <h1>Panda Professor</h1>
        <div className="nav-links">
          <button><Link to="/signup">Go to Signup</Link></button>
          <button><Link to="/login">Go to Login</Link></button>
        </div>
      </nav>
      <div className="content">
        <h2>Submit Your Question or Image</h2>
        <form onSubmit={handleSubmit} className="submission-form">
          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <textarea 
              id="question" 
              value={question} 
              onChange={handleQuestionChange} 
              placeholder="Type your question here..." 
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload an image (optional):</label>
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Forum;

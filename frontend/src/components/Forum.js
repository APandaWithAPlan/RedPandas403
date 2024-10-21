import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './Forum.css';

function Forum() {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const questions = [
    "How do I install React?",
    "What is the use of useState in React?",
    "How to fetch data in React?",
    "What are React Hooks?",
    "How do you handle forms in React?",
  ];

  const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
    const filteredQuestions = questions.filter((question) =>
      question.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

    return (
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for questions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <ul className="dropdown">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <li key={index} className="dropdown-item">{question}</li>
              ))
            ) : (
              <li className="dropdown-item">No matching questions found</li>
            )}
          </ul>
        )}
      </div>
    );
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Question:', question);
    console.log('Image:', image);
    setQuestion('');
    setImage(null);
  };

  return (
    <div className='forum'>
      <nav className="navbar">
        <h1>Panda Professor</h1>
        <SearchBar />
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
              className="textarea"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Upload an image (optional):</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Forum;

import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './Forum.css';

function Forum() {
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  // Questions and answers data
  const qaData = [
    { id: 1, question: "How do I install React?", answer: "You can install React using npm by running: npm install react." },
    { id: 2, question: "What is the use of useState in React?", answer: "useState is a hook that allows you to add React state to function components." },
    { id: 3, question: "How to fetch data in React?", answer: "You can fetch data in React using the fetch API or libraries like Axios." },
    { id: 4, question: "What are React Hooks?", answer: "Hooks are functions that let you 'hook into' React state and lifecycle features in function components." },
    { id: 5, question: "How do you handle forms in React?", answer: "Forms in React are handled by controlling the input values with state using onChange handlers." },
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = qaData.filter((qa) =>
      qa.question.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredQuestions(filtered); 
    setSearchSubmitted(false); 
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = qaData.filter((qa) =>
      qa.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setSearchSubmitted(true);
    setSearchTerm(''); 
  };

  return (
    <div className="forum">
      <nav className="navbar">
        <Link to="/">
          <h1>Panda Professor</h1>
        </Link>
        <form onSubmit={handleSearchSubmit} className="search-bar-container">
          <input
            type="text"
            placeholder="Search for questions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </form>
        <div className="nav-links">
          <button><Link to="/signup">Go to Signup</Link></button>
          <button><Link to="/login">Go to Login</Link></button>
        </div>
      </nav>

      <div className="content">
        {!searchSubmitted && (
          <div>
            <h2>Submit Your Question or Image</h2>
            <form className="submission-form">
              <div className="form-group">
                <label htmlFor="question">Question:</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
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
                  onChange={(e) => setImage(e.target.files[0])}
                  className="file-input"
                />
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        )}

        {searchSubmitted && filteredQuestions.length > 0 && (
          <div className="search-results">
            {filteredQuestions.map((qa) => (
              <div key={qa.id} className="search-result-item">
                <h3>Q: <Link to={`/question/${qa.id}`}>{qa.question}</Link></h3>
                <p>A: <span className="view-answer">See answer</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forum;

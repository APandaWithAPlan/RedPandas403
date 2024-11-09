import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from './UserContext'; // Import the useUser hook
import './Forum.css';

// Load MathJax globally
const loadMathJax = () => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=AM_CHTML';
  script.async = true;
  document.head.appendChild(script);
};

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Forum() {
  const { user, logout } = useUser(); // Access user and setUser from context
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [qaData, setQaData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadMathJax(); // Load MathJax on component mount
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQaData(data);
        reRenderMath();
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }, [qaData, filteredQuestions]);

  const reRenderMath = () => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigateHome = () => {
    navigate('/'); // Navigate to the homepage
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = qaData.filter((qa) =>
      qa.question.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setSearchSubmitted(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filtered = qaData.filter((qa) =>
      qa.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setSearchSubmitted(true);
    setSearchTerm('');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit a question.');
      return navigate('/login');
    }

    const { error } = await supabase
      .from('questions')
      .insert([
        {
          question,
          user_id: user.id,
          image_url: image ? await uploadImage(image) : null,
        },
      ]);

    if (error) {
      console.error('Error submitting question:', error);
    } else {
      alert('Question submitted successfully!');
      setQuestion('');
      setImage(null);
      setQaData((prev) => [...prev, { question, user_id: user.id }]);
      reRenderMath();
    }
  };

  const uploadImage = async (file) => {
    const { data, error } = await supabase.storage.from('images').upload(`public/${file.name}`, file);
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    return data.path; // Return the uploaded image URL or path
  };

  return (
    <div className="forum">
      <nav className="navbar">
        <h1 onClick={handleNavigateHome} className="navbar-title">Panda Professor</h1>
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
          {user ? (
            <>
              <button><Link to="/profile">Profile</Link></button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button><Link to="/signup">Sign Up</Link></button>
              <button><Link to="/login">Login</Link></button>
            </>
          )}
        </div>
      </nav>

      <div className="forum-content">
        <div className="questions-section">
          {searchSubmitted && filteredQuestions.length > 0 ? (
            <div className="search-results">
              {filteredQuestions.map((qa) => (
                <div key={qa.id} className="search-result-item">
                  <h3>Q: <Link to={`/question/${qa.id}`}>{qa.question}</Link></h3>
                  <p>A: <span className="view-answer">See answer</span></p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {qaData.map((qa) => (
                <div key={qa.id} className="search-result-item">
                  <h3>Q: <Link to={`/question/${qa.id}`}>{qa.question}</Link></h3>
                  <p>A: <span className="view-answer">See answer</span></p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="submission-section">
          <h2>Submit a New Question</h2>
          {user ? (
            <form onSubmit={handleQuestionSubmit} className="submission-form">
              <div className="form-group">
                <label htmlFor="question">Question:</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here... Use ` for math notation."
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
          ) : (
            <div>
              <p>You must be logged in to submit a question. Please <Link to="/login">log in</Link>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forum;

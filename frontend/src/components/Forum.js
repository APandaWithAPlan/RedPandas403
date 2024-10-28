import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useUser } from './UserContext'; // Import the useUser hook
import './Forum.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function Forum() {
  const { user } = useUser(); // Access user from context
  const [question, setQuestion] = useState('');
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [qaData, setQaData] = useState([]);
  const navigate = useNavigate();

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*');

      if (error) {
        console.error('Error fetching questions:', error);
      } else {
        setQaData(data);
      }
    };

    fetchQuestions();
  }, []);

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

  // Handle question submission
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to submit a question.');
      return navigate('/login'); // Redirect to login if not logged in
    }

    const { error } = await supabase
      .from('questions')
      .insert([
        {
          question,
          user_id: user.id, // Use the user ID from context
          image_url: image ? await uploadImage(image) : null, // Optionally upload image
        },
      ]);

    if (error) {
      console.error('Error submitting question:', error);
    } else {
      alert('Question submitted successfully!');
      setQuestion('');
      setImage(null);
      setQaData((prev) => [...prev, { question, user_id: user.id }]); // Update local state
    }
  };

  // Function to upload image
  const uploadImage = async (file) => {
    const { data, error } = await supabase.storage.from('images').upload(`public/${file.name}`, file);
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    return data.Key; // Return the uploaded image URL or path
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
            {user ? (
              <form onSubmit={handleQuestionSubmit} className="submission-form">
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
            ) : (
              <div>
                <p>You must be logged in to submit a question. Please <Link to="/login">log in</Link>.</p>
              </div>
            )}
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

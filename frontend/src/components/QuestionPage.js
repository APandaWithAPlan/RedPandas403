import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './QuestionPage.css'; // Ensure this file exists and is correctly linked

// Sample question data (replace this with dynamic data if applicable)
const qaData = [
  { id: 1, question: "How do I install React?", answer: "You can install React using npm by running: npm install react." },
  { id: 2, question: "What is the use of useState in React?", answer: "useState is a hook that allows you to add React state to function components." },
  { id: 3, question: "How to fetch data in React?", answer: "You can fetch data in React using the fetch API or libraries like Axios." },
  { id: 4, question: "What are React Hooks?", answer: "Hooks are functions that let you 'hook into' React state and lifecycle features in function components." },
  { id: 5, question: "How do you handle forms in React?", answer: "Forms in React are handled by controlling the input values with state using onChange handlers." },
];

function QuestionPage() {
  const { id } = useParams(); // Get the ID from the URL params
  const question = qaData.find((q) => q.id === parseInt(id)); // Find the question by ID

  const [response, setResponse] = useState(''); // State to hold user's response
  const [submittedResponse, setSubmittedResponse] = useState(''); // State to hold the submitted response

  // Handle response input change
  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  // Handle form submission
  const handleResponseSubmit = (e) => {
    e.preventDefault();
    setSubmittedResponse(response); // Set the submitted response
    setResponse(''); // Clear the input field after submission
  };

  if (!question) {
    return <p>Question not found.</p>;
  }

  return (
    <div className="question-page">
      <Link to="/forum" className="back-link">← Back to questions</Link>
      <h2>{question.question}</h2>
      <p>{question.answer}</p>

      {/* Reply form */}
      <form onSubmit={handleResponseSubmit} className="response-form">
        <textarea
          value={response}
          onChange={handleResponseChange}
          placeholder="Write your response..."
          required
          className="textarea"
        />
        <button type="submit" className="submit-btn">Submit Response</button>
      </form>

      {/* Display the submitted response */}
      {submittedResponse && (
        <div className="response-display">
          <h3>Your Response:</h3>
          <p>{submittedResponse}</p>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;

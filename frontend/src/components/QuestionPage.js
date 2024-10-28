import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useUser } from './UserContext';
import './QuestionPage.css';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function QuestionPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      setLoading(true);

      // Fetch the question data
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();

      if (questionError) {
        console.error('Error fetching question:', questionError);
        setError('Question not found.');
      } else {
        setQuestion(questionData);

        // Fetch associated answers with user info
        const { data: answersData, error: answersError } = await supabase
          .from('answers')
          .select('id, answer, created_at, user_id, users (username)')
          .eq('question_id', id)
          .order('created_at', { ascending: true });

        if (answersError) {
          console.error('Error fetching answers:', answersError);
        } else {
          setAnswers(answersData);
        }
      }
      setLoading(false);
    };

    fetchQuestionAndAnswers();
  }, [id]);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to submit an answer.');
      return;
    }

    const { data, error } = await supabase
      .from('answers')
      .insert([
        {
          question_id: id,
          answer: answer,
          user_id: user.id, // Use the logged-in user's ID
        },
      ])
      .select('id, answer, created_at, user_id, users (username)')
      .single();

    if (error) {
      console.error('Error submitting answer:', error);
    } else {
      setAnswers((prevAnswers) => [...prevAnswers, data]);
      setAnswer(''); // Clear the input field after submission
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="question-page">
      <Link to="/forum" className="back-link">← Back to questions</Link>
      <h2>{question?.question}</h2>
      <p>{question?.answer || "This question does not have an answer yet."}</p>

      <form onSubmit={handleAnswerSubmit} className="response-form">
        <textarea
          value={answer}
          onChange={handleAnswerChange}
          placeholder="Write your answer..."
          required
          className="textarea"
        />
        <button type="submit" className="submit-btn">Submit Answer</button>
      </form>

      <div className="responses-section">
        <h3>Answers:</h3>
        {answers.length > 0 ? (
          answers.map((ans) => (
            <div key={ans.id} className="response-item">
              <p>
                <strong>{ans.users?.username || 'Anonymous'}:</strong> {ans.answer}
              </p>
              <small>{new Date(ans.created_at).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No answers yet.</p>
        )}
      </div>
    </div>
  );
}

export default QuestionPage;

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useUser } from './UserContext';
import './QuestionPage.css';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function loadMathJax() {
  if (!window.MathJax) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/latest.js?config=AM_CHTML';
    script.async = true;
    document.head.appendChild(script);
  }
}

function QuestionPage() {
  const { id } = useParams();
  const { user } = useUser();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportPostId, setReportPostId] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  useEffect(() => {
    loadMathJax(); // Load MathJax when the component mounts

    const fetchQuestionAndAnswers = async () => {
      setLoading(true);

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
        reRenderMath();
      }

      const { data: answersData, error: answersError } = await supabase
        .from('answers')
        .select('id, answer, created_at, user_id, users (username), like_ratio, like_count')
        .eq('question_id', id)
        .order('created_at', { ascending: true });

      if (answersError) {
        console.error('Error fetching answers:', answersError);
      } else {
        setAnswers(answersData);
        reRenderMath();
      }

      setLoading(false);
    };

    fetchQuestionAndAnswers();
  }, [id]);

  const reRenderMath = () => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
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
          user_id: user.id,
        },
      ])
      .select('id, answer, created_at, user_id, users (username), like_ratio, like_count')
      .single();

    if (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
    } else {
      setAnswers((prevAnswers) => [...prevAnswers, data]);
      setAnswer('');
      reRenderMath(); // Re-render MathJax when a new answer is added
    }
  };

  const handleAnswerLikeRatio = async (answerId, isLike) => {
    if (!user) {
      alert('You must be logged in to vote on an answer.');
      return;
    }

    const answer = answers.find((ans) => ans.id === answerId);

    if (!answer) {
      console.error('Answer not found with ID:', answerId);
      return;
    }

    try {
      const likeAdjustment = isLike ? 1 : -1;

      const { data, error } = await supabase
        .from('answers')
        .update({
          like_ratio: answer.like_ratio + likeAdjustment,
          like_count: answer.like_count + 1,
        })
        .eq('id', answerId)
        .select();

      if (error) {
        console.error('Error updating like ratio:', error);
        setError('Failed to update like/dislike. Please try again.');
        return;
      }

      console.log('Updated answer data:', data);

      setAnswers((prevAnswers) =>
        prevAnswers.map((ans) =>
          ans.id === answerId
            ? { ...ans, like_ratio: ans.like_ratio + likeAdjustment, like_count: ans.like_count + 1 }
            : ans
        )
      );
      reRenderMath(); // Re-render MathJax after updating an answer
    } catch (error) {
      console.error('Unexpected error during like ratio update:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const openReportModal = (postId, type) => {
    setReportPostId(postId);
    setReportType(type);
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!user) {
      alert('You must be logged in to report a post.');
      return;
    }
    const { error } = await supabase
      .from('reported_posts')
      .insert({
        post_id: reportPostId,
        post_type: reportType,
        reported_by: user.id,
        title: reportTitle,
        description: reportDescription,
      });

    if (error) {
      console.error('Error submitting report:', error);
    } else {
      setIsReportModalOpen(false);
      setReportTitle('');
      setReportDescription('');
      alert('Report submitted successfully.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="question-page">
      <Link to="/forum" className="back-link">← Back to questions</Link>
      <h2>{question?.question}</h2>
      {question?.image_url && (
        <div className="question-image">
          <img src={question.image_url} alt="Question related" />
        </div>
      )}
      <p>{answers.length === 0 ? "This question does not have an answer yet." : ""}</p>

      <form onSubmit={handleAnswerSubmit} className="response-form">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer..."
          required
          className="textarea"
        />
        <button type="submit" className="submit-btn">Submit Answer</button>
      </form>

      <div className="responses-section">
        <h3>Answers:</h3>
        {answers.map((ans) => (
          <div key={ans.id} className="response-item">
            <p><strong>{ans.users?.username || 'Anonymous'}:</strong> {ans.answer}</p>
            <small>{new Date(ans.created_at).toLocaleString()}</small>

            <div className="rating-controls">
              <button className={`vote-button ${ans.like_ratio > 0 ? 'upvoted' : ''}`} onClick={() => handleAnswerLikeRatio(ans.id, true)}>
                <span className="upvote-icon">▲</span>
              </button>
              <span className="vote-count">{ans.like_ratio}</span>
              <button className="vote-button" onClick={() => handleAnswerLikeRatio(ans.id, false)}>
                <span className="downvote-icon">▼</span>
              </button>
            </div>

            <button onClick={() => openReportModal(ans.id, 'answer')}>Report Answer</button>
          </div>
        ))}
      </div>

      {isReportModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Report {reportType === 'question' ? 'Question' : 'Answer'}</h3>
            <label>Title:</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              required
            />
            <label>Description:</label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              required
            />
            <button onClick={handleReportSubmit}>Report</button>
            <button onClick={() => setIsReportModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionPage;

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function ReportedPosts() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      const { data, error } = await supabase
        .from('reported_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reported posts:', error);
      } else {
        setReportedPosts(data);
      }
      setLoading(false);
    };

    fetchReportedPosts();
  }, []);

  const handleDeleteQuestion = async (postId) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      const { error: questionError } = await supabase
        .from('questions')
        .delete()
        .eq('id', postId);

      if (questionError) {
        console.error('Error deleting question:', questionError);
        return;
      }

      const { error: reportError } = await supabase
        .from('reported_posts')
        .delete()
        .eq('post_id', postId);

      if (reportError) {
        console.error('Error deleting report:', reportError);
      } else {
        setReportedPosts(reportedPosts.filter((report) => report.post_id !== postId));
        alert('Question and its report deleted successfully.');
      }
    }
  };

  const handleDeleteAnswer = async (postId) => {
    if (window.confirm('Are you sure you want to delete this answer? This action cannot be undone.')) {
      const { error: answerError } = await supabase
        .from('answers')
        .delete()
        .eq('id', postId);

      if (answerError) {
        console.error('Error deleting answer:', answerError);
        return;
      }

      const { error: reportError } = await supabase
        .from('reported_posts')
        .delete()
        .eq('post_id', postId);

      if (reportError) {
        console.error('Error deleting report:', reportError);
      } else {
        setReportedPosts(reportedPosts.filter((report) => report.post_id !== postId));
        alert('Answer and its report deleted successfully.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Reported Posts</h2>
      {reportedPosts.length === 0 ? (
        <p>No reported posts found.</p>
      ) : (
        reportedPosts.map((report) => (
          <div key={report.id} className="report-item">
            <p><strong>Type:</strong> {report.post_type.toUpperCase()}</p>
            <p><strong>Post ID:</strong> {report.post_id}</p>
            <p><strong>Reported by User ID:</strong> {report.reported_by}</p>
            <p><strong>Title:</strong> {report.title}</p>
            <p><strong>Description:</strong> {report.description}</p>
            <p><small>Reported on: {new Date(report.created_at).toLocaleString()}</small></p>
            {report.post_type === 'question' && (
              <button onClick={() => handleDeleteQuestion(report.post_id)}>
                Delete Question
              </button>
            )}
            {report.post_type === 'answer' && (
              <button onClick={() => handleDeleteAnswer(report.post_id)}>
                Delete Answer
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ReportedPosts;

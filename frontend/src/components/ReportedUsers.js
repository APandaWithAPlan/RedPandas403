import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohkvsyqbngdukvqihemh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oa3ZzeXFibmdkdWt2cWloZW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3MTc5NjgsImV4cCI6MjA0NTI5Mzk2OH0.pw9Ffn_gHRr4shp9V-DgisvdqneBHeUZSmvQ61_ES5Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function ReportedUsers() {  // Keeping the function name as requested
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from('subject_suggestions')
        .select('id, subject_name, created_at');

      if (error) {
        console.error('Error fetching subject suggestions:', error);
      } else {
        setSuggestions(data);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div>
      <h2>Subject Suggestions</h2>
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            {suggestion.subject_name} (Submitted on: {new Date(suggestion.created_at).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportedUsers;

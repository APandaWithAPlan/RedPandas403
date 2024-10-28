// src/App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Homepage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';
import Forum from './components/Forum';
import Profile from './components/Profile';
import QuestionPage from './components/QuestionPage';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/question/:id" element={<QuestionPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile  />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
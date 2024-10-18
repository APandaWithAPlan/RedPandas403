
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import Signup from './components/Signup';
import Login from './components/Login';
import Forum from './components/Forum';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element = {<Homepage/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forum" element={<Forum/>} />
      </Routes>
    </Router>
  );

}
export default App;


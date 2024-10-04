import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <button><Link to="/signup">Go to Signup</Link></button>
      <button><Link to="/login">Go to Login</Link></button>
    </div>
  );
}

export default Homepage;

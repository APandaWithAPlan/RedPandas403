function Signup() {
    return (
      <div>
        <h1>Signup</h1>
        <form>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label htmlFor="studentEmail">Student Email:</label>
            <input type="email" id="studentEmail" name="studentEmail" required />
          </div>
          <div>
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required />
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  }
  
  export default Signup;
  
import { useState } from "react";
import { Link } from "react-router-dom";
import { Registration } from "../../../api/requests/auth";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  return (
    <>
      <h1>Register</h1>
      <p>if you are already registered go to the <Link to="/login">LogIn</Link> Page</p>
      <form onSubmit={(e) => Registration(e,userName, password, confirmPassword)}>
        <label htmlFor="username">UserName</label>
        <input
          id="username"
          type="text"
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button disabled={password.localeCompare(confirmPassword)} type="submit">Sign Up</button>
      </form>
    </>
  );
};

export default Register;

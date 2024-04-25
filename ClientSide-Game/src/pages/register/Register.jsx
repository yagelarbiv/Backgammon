import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore"
import "../logIn/login.css";
import NavBar from "../../components/Header";

const Register = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const setuser = useUserStore((state) => state.setuser);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    console.log(userName, password);
    try {
      const response = await axios.post(authUrl + "/register", {
        UserName: userName,
        Password: password,
        ConfirmPassword: confirmPassword,
      });
      console.log(response);
      setuser(userName);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <NavBar />
      <div className="login-body">
        <div className="login-title">
          <h1>Sign-Up</h1>
          <form onSubmit={submit} className="loginForm">
            <label htmlFor="username" className="username-label">
              UserName
            </label>
            <input
              id="username"
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              className="input"
            />
            <label htmlFor="password" className="password-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <label htmlFor="confirmPassword" className="password-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
            <br />
            <button
              disabled={password.localeCompare(confirmPassword)}
              type="submit"
              onClick={submit}
              className="submit-button"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore"
import useAuthStore from "../../stores/authStore";
import "../logIn/login.css";
import { Registeration } from "../../api/requests/auth";

const Register = () => {
  const setuser = useUserStore((state) => state.setuser);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setRefreshToken = useAuthStore(state => state.setRefreshToken);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
async function submit(e) {
    e.preventDefault();
    console.log(userName, password);
    try {
      const response = await Registeration(userName, password, confirmPassword);
      if (response == false) {
        return alert("username already exists");
      }
      console.log(response);
      setuser(userName);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }
return (
    <>
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
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    console.log(name, password);
    try {
      await axios.post("https://localhost:6001/api/auth/register", {
        UserName: userName,
        Password: password,
        ConfirmPassword: confirmPassword
      })
      .then(function (response) {
        localStorage.setItem("User", {
          username: jwtDecode(response.data.accessToken)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          AccessToken: response.data.AccessToken,
          RefreshToken: response.data.RefreshToken
        });
        navigate("/");
      })
      .catch(function (error) {
        console.log(error);
      });
    } catch (err) {
      console.log(err);
    }
    
  }
  return (
    <>
      <h1>Register</h1>
      <form onSubmit={submit}>
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
        <button type="submit" onClick={submit}>Sign Up</button>
      </form>
    </>
  );
};

export default Register;

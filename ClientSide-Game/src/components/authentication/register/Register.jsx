import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const authUrl = import.meta.env.VITE_APP_AUTH_URL;

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  
  async function Registration (e){
    e.preventDefault();
    console.log(userName, password);
    try {
      await axios.post(authUrl+"/register", {
        UserName: userName,
        Password: password,
        ConfirmPassword: confirmPassword
      })
      .then(function (response) {
        console.log(response.data.accessToken);
        localStorage.setItem("User", JSON.stringify({
          username: jwtDecode(response.data.accessToken)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
          AccessToken: response.data.accessToken,
          RefreshToken: response.data.refreshToken
        }));
        console.log(JSON.parse(localStorage.getItem("User")));
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
      <p>if you are already registered go to the <Link to="/login">LogIn</Link> Page</p>
      <form onSubmit={(e) => Registration(e)}>
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

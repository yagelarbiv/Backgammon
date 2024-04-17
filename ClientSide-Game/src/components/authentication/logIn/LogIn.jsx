import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const authUrl = import.meta.env.VITE_APP_AUTH_URL;

const LogIn = () => {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function Login(e){
    e.preventDefault();
      try {
        await axios.post(authUrl+"/login", {
          UserName: userName,
          Password: password,
        })
        .then(function (response) {
          localStorage.setItem("User", {
            username: jwtDecode(response.data.accessToken)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            AccessToken: response.data.AccessToken,
            RefreshToken: response.data.RefreshToken
          });
          navigate("/");
        })
      } catch (err) {
        console.log(err);
      }
  }

  return (
    <>
      <div>
        <h1>Log In</h1>
        <p>if you are already registered go to the <Link to="/register">SignUp</Link> Page</p>
        <form method="POST">
          <label htmlFor="username">UserName</label>
          <input name="username" id="username" type="text" onChange={(e) => setName(e.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button disabled={!password || !userName} type="submit" onClick={(e) => Login(e)}>Log In</button>
        </form>
      </div>
    </>
  );
}

export default LogIn;

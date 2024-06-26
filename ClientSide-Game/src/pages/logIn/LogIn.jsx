import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import useAuthStore from "../../stores/authStore";
import './login.css' ;
import { LogingIn } from "../../api/requests/auth";



const LogIn = () => {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const setuser = useUserStore(state => state.setuser);
  const setAccessToken = useAuthStore(state => state.setAccessToken);
  const setRefreshToken = useAuthStore(state => state.setRefreshToken);

  const navigate = useNavigate();
async function submit(e) {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const response = await LogingIn(userName, password);
      console.log(response);
      if (response == false) {
        return(
          alert("Wrong username or password")
        )
      }
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      console.log("accessToken:", accessToken);
      console.log("refreshToken:", refreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setuser({ userName });
      navigate("/");

    } catch (err) {
      console.log(err);
    }

  }
return (
      <>
      <div className="login-body">
        <div className="login-page">
          <h1 className="login-title">Log In</h1>
          <form method="POST" className="loginForm">
            <label className="username-label" htmlFor="username">UserName</label>
            <input name="username" id="username" type="text" onChange={(e) => setName(e.target.value)} />
            <label className="password-label" htmlFor="password">Password</label>
            <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <br />
            <button className="login-button" disabled={!password || !userName } type="submit" onClick={submit}>Log In</button>
          </form>
        </div>
      </div>
      </>
    );

}

export default LogIn;
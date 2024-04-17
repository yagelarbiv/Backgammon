import axios from "axios";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../../storage/userStore";

const LogIn = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore(state => state.setUser)
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(authUrl + "/login", {
        UserName: userName,
        Password: password,
      });
      const accessToken = response.data.accessToken;
      const refreshedToken = response.data.refreshToken
      const username = jwtDecode(accessToken)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]

      // Saving in zustand to get it in the chat and in the game.
      setUser({ username, accessToken , refreshedToken });

      //Routing to the main page.
      navigate("/");
      
    } catch (err) {
      console.log(err);
    }
  }
    return (
      <>
        <div>
          <h1>Log In</h1>
          <form method="POST">
            <label htmlFor="username">UserName</label>
            <input name="username" id="username" type="text" onChange={(e) => setName(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button disabled={!password || !userName } type="submit" onClick={submit}>Log In</button>
          </form>
        </div>
      </>
    );

}

export default LogIn;

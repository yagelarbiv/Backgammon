import { useState } from "react";
import { Link } from "react-router-dom";
import { Login } from "../../../api/requests/auth";

const LogIn = () => {
  const [userName, setName] = useState("");
  const [password, setPassword] = useState("");
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
            <button disabled={!password || !userName } type="submit" onClick={(e) => Login(e, userName, password)}>Log In</button>
          </form>
        </div>
      </>
    );

}

export default LogIn;

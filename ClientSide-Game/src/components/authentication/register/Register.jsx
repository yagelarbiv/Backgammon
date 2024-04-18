import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../../storage/userStore";


const Register = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const setuser = useUserStore(state => state.setuser);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();
    console.log(userName, password);
    try {
      const response = await axios.post(authUrl+"/register", {
        UserName: userName,
        Password: password,
        ConfirmPassword: confirmPassword
      })
      console.log(response);
      setuser(userName);
      navigate("/");
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
        <button disabled={password.localeCompare(confirmPassword)} type="submit" onClick={submit}>Sign Up</button>
      </form>
    </>
  );
};

export default Register;

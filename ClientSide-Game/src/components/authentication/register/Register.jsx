import { useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const authUrl = import.meta.env.VITE_APP_AUTH_URL;

const Register = () => {
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../../../storage/userStore";


const Register = () => {
  const authUrl = import.meta.env.VITE_APP_AUTH_URL;
  const setuser = useUserStore(state => state.setuser);

<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
<<<<<<< HEAD
<<<<<<< HEAD
  
  async function Registration (e){
    e.preventDefault();
    console.log(userName, password);
    try {
      await axios.post(authUrl+"/register", {
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
  async function submit(e) {
    e.preventDefault();
    console.log(userName, password);
    try {
      const response = await axios.post(authUrl+"/register", {
<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        UserName: userName,
        Password: password,
        ConfirmPassword: confirmPassword
      })
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
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
<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
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
<<<<<<< HEAD
<<<<<<< HEAD
        <button disabled={password.localeCompare(confirmPassword)} type="submit">Sign Up</button>
=======
        <button disabled={password.localeCompare(confirmPassword)} type="submit" onClick={submit}>Sign Up</button>
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
        <button disabled={password.localeCompare(confirmPassword)} type="submit" onClick={submit}>Sign Up</button>
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
      </form>
    </>
  );
};

export default Register;

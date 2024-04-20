<<<<<<< HEAD
import { useEffect } from "react";
import axios from "axios";

const AuthPage = () => {
  useEffect(() => {
    console.log("hello", axios.defaults.baseURL);
  });
=======
import React, { useEffect } from "react";
import NavBar from "./NavBar";


const AuthPage = () => {
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
  return (
    <>
      <h1>Hello User!</h1>
      <h3>Please Log In Or Sign Up</h3>
<<<<<<< HEAD
=======
      <LogInOut />
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
    </>
  );
};

export default AuthPage;

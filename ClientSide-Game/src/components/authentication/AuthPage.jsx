import React, { useEffect } from "react";
import NavBar from "./NavBar";
import axios from "axios";

const AuthPage = () => {
  useEffect(() => {
    console.log("hello", axios.defaults.baseURL);
  });
  return (
    <>
      <h1>Hello User!</h1>
      <h3>Please Log In Or Sign Up</h3>
      <LogInOut />
    </>
  );
};

export default AuthPage;

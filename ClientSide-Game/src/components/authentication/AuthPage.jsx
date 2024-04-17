import React, { useEffect } from "react";
import NavBar from "./NavBar";


const AuthPage = () => {
  return (
    <>
      <h1>Hello User!</h1>
      <h3>Please Log In Or Sign Up</h3>
      <LogInOut />
    </>
  );
};

export default AuthPage;

import { useEffect } from "react";
import axios from "axios";

const AuthPage = () => {
  useEffect(() => {
    console.log("hello", axios.defaults.baseURL);
  });
  return (
    <>
      <h1>Hello User!</h1>
      <h3>Please Log In Or Sign Up</h3>
    </>
  );
};

export default AuthPage;

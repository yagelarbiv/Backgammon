import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const user = Object.fromEntries(formData);
    try {
      const data = await axios.post(
        "/api/auth/register",
        {
          userName: userName,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "text",
        }
      );
      navigate("/");

      console.log(data);
      const token = data.data;
      console.log(token);
      return token;
    } catch (err) {
      console.log(err.message);
    }
  };
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
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
};

export default Register;

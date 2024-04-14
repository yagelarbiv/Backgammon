import React from "react";

const LogIn = () => {
  const read = () => {
    
  };
  return (
    <>
      <div>
        <h1>Log In</h1>
        <form>
          <label htmlFor="username">UserName</label>
          <input id="username" type="text" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
          <button type="submit">Log In</button>
        </form>
      </div>
    </>
  );
};

export default LogIn;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LogIn from "./components/authentication/logIn/LogIn.jsx";
import Register from "./components/authentication/register/Register.jsx";
import axios from "axios";
import axios2 from "axios";
import LogInOut from "./components/authentication/LogInOut.jsx";

axios.defaults.baseURL = "https://localhost:7208/";
axios2.defaults.baseURL = "http://localhost:5000"; // Configure the base URL for the second axios instance

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LogIn />, 
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/api/data",
    element: <App />,
  },
  {
    path: "/logout",
    element: <LogInOut />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

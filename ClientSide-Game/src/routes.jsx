// routes.js
import App from "./App";
import LogIn from "./pages/logIn/LogIn";
import Register from "./pages/register/Register";
import LogInOut from "./pages/LogInOut";
import Home from "./pages/home/Home";

const routes = [
  { path: "/login", element: <LogIn /> },
  { path: "/register", element: <Register /> },
  { path: "/logout", element: <LogInOut /> },
  { path: "/", element: <Home /> },

];



export default routes;

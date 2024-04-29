// routes.js
import LogIn from "./pages/logIn/LogIn";
import Register from "./pages/register/Register";
import LogInOut from "./pages/LogInOut";
import Home from "./pages/home/Home";
import ChatApp from "./components/chat/ChatApp";

const routes = [
  { path: "/login", element: <LogIn /> },
  { path: "/register", element: <Register /> },
  { path: "/logout", element: <LogInOut /> },
  { path: "/", element: <Home /> },
  { path: "/chat", element: <ChatApp/>},

];



export default routes;

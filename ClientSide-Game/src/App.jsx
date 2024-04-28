import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;

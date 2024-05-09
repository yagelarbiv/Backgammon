import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;

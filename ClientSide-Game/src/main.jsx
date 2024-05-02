import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = document.getElementById("root");
const rootElement = createRoot(root);
rootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

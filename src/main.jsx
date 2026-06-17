import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// global CSS still works alongside CSS Modules
import "./index.css"; // resets, fonts, CSS variables - truly global

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

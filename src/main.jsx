import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import StarRating from "./StarRating.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StarRating maxRating={7} />
  </StrictMode>,
);

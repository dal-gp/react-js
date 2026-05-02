import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import StarRating from "./StarRating.jsx";
import Test from "./Test.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StarRating
      maxRating={5}
      // color="blue"
      // size={64}
      // className="test"
      // messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      // defaultRating={2}
    />
    <Test />
  </StrictMode>,
);

// Each page includes PageNav at the top
// Same pattern in Pricing.jsx and Product.jsx
import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";

function Homepage() {
  return (
    <div>
      <PageNav />
      <h1>Homepage</h1>
    </div>
  );
}

export default Homepage;

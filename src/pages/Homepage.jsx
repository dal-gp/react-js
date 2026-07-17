// Each page includes PageNav at the top
// Same pattern in Pricing.jsx and Product.jsx
import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";
import PageNav from "../components/PageNav";
function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          You travel the world.
          <br />
          WorldWise keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
        {/* "cta" is a GLOBAL class define din index.css - used in
        multiple places, so it doesn't make sense to scope it to one module */}
        <Link to="/login" className="cta">
          Start tracking now
        </Link>
      </section>
    </main>
  );
}

export default Homepage;

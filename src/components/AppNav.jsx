/**
 * Sub-avigation for the main app screen (cities/countries).
 * Links between nested routes - NavLink adds 'active' class automatically.
 * Form is NOT linked here - it opens when user clicks the map.
 */
import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";
function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/app/cities">Cities</NavLink>
        </li>
        <li>
          <NavLink to="/app/countries">Countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;

/**
 * Reusable navigation bar included in every page.
 * Uses NavLink so the current page's link gets class="active" automatically
 * Style the .active class in CSS to highlight the current page.
 *
 * NavLink - adds active class (use in nav menus)
 * Link - no active class (use elsewhere)
 */
import { Link, NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";

function PageNav() {
  return (
    <div>
      <nav className={styles.nav}>
        <Logo />
        <ul>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={styles.ctaLink}>
              Login
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PageNav;

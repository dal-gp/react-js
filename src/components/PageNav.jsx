/**
 * Reusable navigation bar included in every page.
 * Uses NavLink so the current page's link gets class="active" automatically
 * Style the .active class in CSS to highlight the current page.
 *
 * NavLink - adds active class (use in nav menus)
 * Link - no active class (use elsewhere)
 */
import { NavLink } from "react-router-dom";

function PageNav() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/product">Product</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default PageNav;

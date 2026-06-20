/**
 * Left sidebar of the main app layout.
 * Contains logo, navigation, city list, footer
 */
import Logo from "../components/Logo";
import AppNav from "../components/AppNav";
import styles from "./Sidebar.module.css";
import { Outlet } from "react-router-dom";
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      {/* Outlet renders whichever child route matches the current URL.
      Similar to children prop but dirven by the URL, not the JSX. */}
      <Outlet />

      <footer className={styles.footer}>
        {/* Dynamic year so this never needs manual updating */}
        <p className={styles.copyright}>
          &copy; Copyright {new Date().getFullYear()} by WorldWide Inc.
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;

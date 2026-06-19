/**
 * Left sidebar of the main app layout.
 * Contains logo, navigation, city list (placeholder), footer
 */
import Logo from "../components/Logo";
import AppNav from "../components/AppNav";
import styles from "./Sidebar.module.css";
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <p>List of cities</p>
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

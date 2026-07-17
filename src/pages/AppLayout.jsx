/**
 * Layout for the main application screen (list + map view).
 * Kept intenstially minimal - all content and logic lives inside components.
 * No compositions needed here since no props are passed through AppLayout
 */
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import User from "../components/User";
import styles from "./AppLayout.module.css";
function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";

/**
 * Displays the logged-in user's avatar nad name.
 * Logout button logs out and navigates to "/" immediately -
 * must navigate before re-render since user becomes null after logout.
 * @returns
 *
 */
function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    logout();
    navigate("/"); // navigate BEFORE re-render reads null.avatar
  }
  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;

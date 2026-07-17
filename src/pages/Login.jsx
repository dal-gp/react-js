import { useEffect, useState } from "react";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
function Login() {
  // Pre-filled for dev convenience - would be empty strings in prod
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  /**
   * Redirect to /app after successful login.
   * useEffect needed because login() updates state async - isAuthenticated
   * isnot true yet when handleSubmit runs.
   * { replace: true } prevents Back button redirect loop.
   */
  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/app", { replace: true });
      }
    },
    [isAuthenticated, navigate],
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}

export default Login;

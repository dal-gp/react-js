import { useEffect } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Protects routes from unauthorized access.
 * Redirects to "/" if the user is not authenticated.
 *
 * IMPORTANT: Returns null when not authenticated - NOT children.
 * Reason: useEffect fires AFTER render. If children rendered first,
 * components like User would try to read user.avatar (null) and crash
 * before the redirect could happen.
 *
 * @param {React.ReactNode} children - The protected content (e.g. AppLayout)
 * @returns
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [isAuthenticated, navigate],
  );
  // Return null while redirecting - prevents children from mounting
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;

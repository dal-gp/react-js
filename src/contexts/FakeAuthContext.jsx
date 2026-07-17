import { createContext, useReducer, useContext } from "react";

/**
 * Hardcoded fake user - in real auth this comes from a database.
 * Lives outside the component - constant, never recreated on re-render.
 */
const FAKE_USER = {
  name: "Joe",
  email: "joe@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initalState = {
  isAuthenticated: false,
  user: null,
};

/**
 * Auth reducer - only two actions, both update user and isAuthenticated together.
 * Always spread state even i foverriding all properties - future-proofs the reducer.
 */
function reducer(state, action) {
  switch (action.type) {
    case "login": {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    }
    case "logout": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    default:
      throw new Error("Unknown action");
  }
}

/**
 * Auth provider - manages login/logout state for the entire app.
 * Uses fake credential check insteadc of an API call.
 * In real auth: login() would make an API call, same pattern otherwise.
 *
 * @param {React.ReactNode} children
 * @returns
 */
function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initalState,
  );

  /**
   * Logs in a user if credetnials match the fake user.
   * In real auth: would await an API call here.
   *
   * @param {string} email
   * @param {stringj} password
   */
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      console.log("Invalid credentials");
    }
  }

  /**
   * Logs out the current user - resets user and isAuthenticated
   */
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume AuthContext.
 *
 * @returns {{user, isAuthenticated, login, logout}}
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside the AuthProvider");
  return context;
}

export { AuthProvider, useAuth };

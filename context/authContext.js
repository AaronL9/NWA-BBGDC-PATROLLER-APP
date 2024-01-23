import { createContext, useState, useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../config/firebase";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  authenticating: false,
  authError: null,
  userData: {},
});

function AuthContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async ({ identifier, password }) => {
    setAuthenticating(true);
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/patroller/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setAuthError(json.error);
        console.log(json);
        setAuthenticating(false);
        return;
      }

      const userCredential = await signInWithCustomToken(auth, json.token);
      const user = userCredential.user;
      console.log("User signed in:", user.uid);
    } catch (error) {
      console.log(error);
    }
    setAuthenticating(false);
  };

  async function logout() {
    try {
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  const value = {
    userData,
    login,
    logout,
    authenticating,
    isAuthenticated: false,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

import { createContext, useState, useEffect } from "react";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const AuthContext = createContext({
  user: {},
  avatar: "",
  isAuthenticated: false,
  authenticating: false,
  authError: null,
  patrollerLocation: {},
  login: () => {},
  logout: () => {},
  setUser: () => {},
  setAvatar: () => {},
  setPatrollerLocation: () => {},
});

function AuthContextProvider({ children }) {
  const [user, setUser] = useState({ isAuthenticated: false, data: null });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [patrollerLocation, setPatrollerLocation] = useState(null);

  const login = async ({ identifier, password }) => {
    setAuthenticating(true);
    try {
      const response = await fetch(
        `https://${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/patroller/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      const { user: userInfo } = await signInWithCustomToken(auth, json.token);

      if (userInfo) {
        const { claims } = await userInfo.getIdTokenResult();
        if (!claims?.patroller) {
          setUser({ data: null, isAuthenticated: false });
          logout();
          throw new Error("you don't have permission to access this app");
        }
      }
      setAuthError(null);
    } catch (error) {
      setAuthenticating(false);
      setAuthError(error.message);
    }
  };

  async function logout() {
    try {
      await signOut(auth);
      setUser({ data: null, isAuthenticated: false });
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "patrollers", user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        delete data.password;
        setUser({ isAuthenticated: true, data });
      }
      setLoading(false);
      setAuthenticating(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    setUser,
    login,
    logout,
    authenticating,
    authError,
    patrollerLocation,
    setPatrollerLocation,
    avatar,
    setAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

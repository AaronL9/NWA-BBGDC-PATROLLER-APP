import { createContext, useState, useEffect } from "react";
import { query, collection, where, getDocs } from "@firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  authenticating: false,
  authError: null,
  user: {},
  patrollerLocation: {},
  setPatrollerLocation: () => {},
  avatar: "",
  setAvatar: () => {},
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
        setAuthError(json.error);
        setAuthenticating(false);
        return;
      }

      await signInWithCustomToken(auth, json.token);
    } catch (error) {
      setAuthenticating(false);
      setAuthError(error);
    }
  };

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "patrollers"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const doc = querySnapshot.docs[0];
          const userData = { ...doc.data(), docId: doc.id };

          setUser({ isAuthenticated: true, data: userData });
        } catch (error) {
          console.log("Fetch User Data Error: ", error);
        }
        try {
          const uri = await getDownloadURL(
            ref(storage, `patrollers/${user.uid}/profile_pic`)
          );
          setAvatar(uri);
        } catch (error) {
          setAvatar(null);
        }
      } else {
        setUser({ data: null, isAuthenticated: false });
      }
      setLoading(false);
      setAuthenticating(false);
      setAuthError(null);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
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

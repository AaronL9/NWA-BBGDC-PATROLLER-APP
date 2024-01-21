import { createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { validateLoginForm } from "../util/formValidation";

export const AuthContext = createContext({
  currentUser: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  authenticating: false,
  authError: null,
  userData: {},
});

function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  async function login({ email, password }) {
    setAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.code);
      setAuthError(validateLoginForm(error.code));
    }
  }

  async function logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const q = query(
            collection(db, "patrollers"),
            where("uid", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const doc = querySnapshot.docs[0];
          setUserData({ ...doc.data(), docId: doc.id });
        } catch (error) {
          console.log("Fetch User Data Error: ", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
      setAuthenticating(false);
      setAuthError(null);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    logout,
    authenticating,
    isAuthenticated: !!currentUser,
    authError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

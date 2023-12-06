import { Alert } from "react-native";
import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { validateLoginForm } from "../util/formValidation";

export const AuthContext = createContext({
  currentUser: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  isAuthenticated: false,
  authenticating: false,
  authError: null,
  userData: {},
});

function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);

  async function signup(credential) {
    setAuthenticating(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        credential.email,
        credential.password
      );
      const { firstName, lastName, contactNum } = credential;
      const data = {
        uid: user.uid,
        firstName,
        lastName,
        contactNum,
      };
      await addDoc(collection(db, "users"), data);
      setUserData(data);
    } catch (error) {
      let errorMessage = "Failed to sign you up";
      if (error.message.includes("email-already-in-use")) {
        errorMessage = "Email already in use";
      }
      Alert.alert("Signup Failed", errorMessage);
    }
    setAuthenticating(false);
  }

  async function login({ email, password }) {
    setAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.code);
      setAuthError(validateLoginForm(error.code));
    }
    setAuthenticating(false);
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
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setUserData(querySnapshot.docs[0].data());
      } catch (error) {
        console.log(error)
      }
      setLoading(false);
      console.log(userData);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    signup,
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

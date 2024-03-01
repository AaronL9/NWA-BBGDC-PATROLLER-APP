import { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

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
  setAuthenticating: () => {},
});

function AuthContextProvider({ children }) {
  const [user, setUser] = useState({ isAuthenticated: false, data: null });
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [patrollerLocation, setPatrollerLocation] = useState(null);

  async function logout() {
    try {
      await auth().signOut();
      setUser({ data: null, isAuthenticated: false });
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = await firestore()
          .collection("patrollers")
          .doc(user.uid)
          .get();

        const token = await user.getIdToken();
        setUser({
          isAuthenticated: true,
          data: userData.data(),
          token,
        });
      }
      setLoading(false);
      setAuthenticating(false);
      // console.log(JSON.stringify(user, null, 2));
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    setUser,
    logout,
    authenticating,
    patrollerLocation,
    setPatrollerLocation,
    setAuthenticating,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

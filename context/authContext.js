import { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const initialUser = { isAuthenticated: false, data: null };
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [patrollerLocation, setPatrollerLocation] = useState(null);

  async function logout() {
    try {
      await auth().signOut();
      setUser(initialUser);
    } catch (error) {
      console.log(error.code, error.message);
    }
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const location = await AsyncStorage.getItem("device_location");
          if (location) setPatrollerLocation(location);

          await AsyncStorage.setItem("uid", user.uid);
          const result = await user.getIdTokenResult();

          if (!result.claims?.patroller) {
            await logout();
            return;
          }

          const userData = await firestore()
            .collection("patrollers")
            .doc(user.uid)
            .get();

          if (!userData.exists) {
            await logout();
            return;
          }

          setUser({
            isAuthenticated: true,
            data: userData.data(),
            token: result.token,
          });
        } catch (error) {
          await logout();
          alert("Can't sign you in");
        }
      } else {
        setUser(initialUser);
      }
      setLoading(false);
      setAuthenticating(false);
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

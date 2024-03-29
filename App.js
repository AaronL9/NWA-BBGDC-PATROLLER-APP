import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AuthContextProvider, { AuthContext } from "./context/authContext.js";
import Authentication from "./stack/Authentication.jsx";
import Home from "./stack/Home.jsx";
import { useContext } from "react";

function Root() {
  const { user, authenticating } = useContext(AuthContext);
  return user.isAuthenticated && !authenticating ? (
    <Home />
  ) : (
    <Authentication />
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </AuthContextProvider>
    </>
  );
}

import { View, StyleSheet, StatusBar, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { credentialFieldProps } from "../util/credentialFieldProps";
import { AuthContext } from "../context/authContext";
import { Colors } from "../constants/colors";

// components
import CredentialField from "../components/auth/CredentialField";
import AuthButton from "../components/auth/AuthButton";
import Header from "../components/Header";
import Loader from "../components/global/Loader";
import ErrorLoginMessage from "../components/auth/ErrorLoginMessage";

export default function Login() {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [credential, setCredential] = useState({
    email: "",
    passowrd: "",
  });

  const loginInHandler = async () => {
    authCtx.login(credential);
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={{ width: "100%" }}>
        <Header
          customStyle={styles.headerStyle}
          imageStyle={styles.headerImage}
        />
        <View style={styles.loginContainer}>
          <View style={styles.inputContainerStyle}>
            <CredentialField {...credentialFieldProps(setCredential).email} />
            <CredentialField
              {...credentialFieldProps(setCredential).passowrd}
            />
          </View>
          {authCtx.authError && (
            <ErrorLoginMessage message={authCtx.authError} />
          )}
          <AuthButton title={"Login"} onPress={loginInHandler} />
          <Text style={{ color: "white" }}>
            Don't have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate("Signup")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </ScrollView>
      {authCtx.authenticating && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: StatusBar.currentHeight + 25,
    flex: 1,
    backgroundColor: "white",
    backgroundColor: Colors.bgPrimaary400,
    alignItems: "center",
    justifyContent: "center",
  },
  headerStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 200,
    height: 200,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "start",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    // borderWidth: 2,
  },
  inputStyle: {
    flex: 1,
    // borderWidth: 2,
  },
  signUpLink: {
    color: Colors.accent,
  },
});

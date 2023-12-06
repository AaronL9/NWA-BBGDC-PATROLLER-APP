import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, StatusBar, ScrollView } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { AuthContext } from "../context/authContext";
import { Colors } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

// utils
import {
  credentialFieldProps,
  signUpInitValue,
} from "../util/credentialFieldProps";
import { validateSignUpForm } from "../util/formValidation";

// components
import CredentialField from "../components/auth/CredentialField";
import AuthButton from "../components/auth/AuthButton";
import Header from "../components/Header";
import Loader from "../components/global/Loader";

const Signup = () => {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  const [credential, setCredential] = useState(signUpInitValue);
  const [errors, setErrors] = useState({});

  const signUpHanlder = async () => {
    const isValid = validateSignUpForm(credential, setErrors);
    if (isValid) {
      authCtx.signup(credential);
      return;
    }
  };

  useEffect(() => {}, [credential]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView>
        <Header
          customStyle={styles.headerSytle}
          imageStyle={styles.headerImage}
        />
        <View style={styles.loginContainer}>
          <View style={styles.rowContainer}>
            <CredentialField
              {...credentialFieldProps(setCredential).firstName}
            />
            <CredentialField
              {...credentialFieldProps(setCredential).lastName}
            />
          </View>
          <View style={styles.stackContainer}>
            <CredentialField {...credentialFieldProps(setCredential).email} />
            <CredentialField {...credentialFieldProps(setCredential).phone} />
            <CredentialField
              {...credentialFieldProps(setCredential).passowrd}
            />
            <CredentialField
              {...credentialFieldProps(setCredential).confirmPassword}
            />
          </View>
          {Object.keys(errors).length !== 0 && (
            <View style={styles.errorsContainer}>
              {Object.values(errors).map((error, index) => (
                <View key={index} style={styles.error}>
                  <Octicons
                    name="dot-fill"
                    size={16}
                    color={Colors.errorBullet}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ))}
            </View>
          )}
          <AuthButton title={"Signup"} onPress={signUpHanlder} />
          <Text style={{ color: "white" }}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
      {authCtx.authenticating && <Loader />}
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: StatusBar.currentHeight + 25,
    flex: 1,
    backgroundColor: Colors.bgPrimaary400,
  },
  headerSytle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  headerImage: {
    width: 100,
    height: 100,
  },
  loginContainer: {
    flex: 5,
    justifyContent: "start",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    // borderWidth: 2,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 16,
    // borderWidth: 2,
  },
  stackContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  errorsContainer: {
    width: "100%",
    backgroundColor: Colors.errorsContainer,
    gap: 5,
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  errorText: {
    color: Colors.errorText,
  },
  loginLink: {
    color: Colors.accent,
  },
});

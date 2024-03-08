import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Colors } from "../constants/colors";

// firebase
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// components
import AuthButton from "../components/auth/AuthButton";
import Header from "../components/Header";
import ErrorLoginMessage from "../components/auth/ErrorLoginMessage";

// utilities
import { validatePhoneNumber } from "../util/formValidation";
import {
  extractErrorMessage,
  formatPhoneNumber,
} from "../util/stringFormatter";
import SignInField from "../components/auth/SignInField";
import { checkPatrollerExistence } from "../util/accessControl";

export default function Login() {
  const { setAuthenticating } = useContext(AuthContext);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState(null);

  const sendCodeHandler = async () => {
    setError(null);
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber, setError);
    if (!formattedPhoneNumber) return;
    try {
      setAuthenticating(true);

      await checkPatrollerExistence(formattedPhoneNumber);

      const confirmation = await auth().signInWithPhoneNumber(
        formattedPhoneNumber
      );
      setConfirm(confirmation);
    } catch (error) {
      console.log("Error sending code: ", error);
      const errorMessage = error?.code || error?.message;
      setError(extractErrorMessage(errorMessage));
    } finally {
      setAuthenticating(false);
    }
  };

  const confirmCode = async () => {
    setError(null);
    try {
      setAuthenticating(true);
      await confirm.confirm(code);
    } catch (error) {
      console.log("Invalid code: ", error.code);
      setError(extractErrorMessage(error.code));
      setAuthenticating(false);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={{ width: "100%" }}>
        <Header
          customStyle={styles.headerStyle}
          imageStyle={styles.headerImage}
        />
        <View style={styles.loginContainer}>
          {!confirm ? (
            <>
              <View style={styles.inputContainerStyle}>
                <SignInField
                  icon="phone-android"
                  setValue={setPhoneNumber}
                  placeholder="Phone Number"
                />
              </View>
              {error && <ErrorLoginMessage message={error} />}
              <AuthButton title={"Login"} onPress={sendCodeHandler} />
            </>
          ) : (
            <>
              <View style={styles.inputContainerStyle}>
                <SignInField
                  icon="confirmation-number"
                  setValue={setCode}
                  placeholder="Code"
                />
              </View>
              {error && <ErrorLoginMessage message={error} />}
              <AuthButton title={"Confirm"} onPress={confirmCode} />
            </>
          )}
        </View>
      </ScrollView>
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

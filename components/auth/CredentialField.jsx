import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const CredentialField = ({
  icon,
  placeholder,
  customStyle,
  isPassword = false,
  changeTextHandler = () => {},
  inputType = "text",
}) => {
  return (
    <View style={[styles.inputContainerStyle, customStyle]}>
      <Ionicons name={icon} size={24} color={Colors.primary400} />
      <TextInput
        autoCapitalize="none"
        secureTextEntry={isPassword}
        style={styles.inputStyle}
        placeholder={placeholder}
        onChangeText={changeTextHandler}
        inputMode={inputType}
      />
    </View>
  );
};

export default CredentialField;

const styles = StyleSheet.create({
  inputContainerStyle: {
    marginTop: 16,
    borderRadius: 6,
    flexDirection: "row",
    borderBottomWidth: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
    gap: 5,
    borderBottomColor: Colors.primary400,
    backgroundColor: "#f6f6f6",
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    flex: 1,
    // borderWidth: 2,
  },
});

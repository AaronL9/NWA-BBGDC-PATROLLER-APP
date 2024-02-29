import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

const SignInField = ({ setValue, placeholder, icon }) => {
  return (
    <View style={styles.inputContainerStyle}>
      <MaterialIcons name={icon} size={24} color={Colors.primary400} />
      <TextInput
        keyboardType="number-pad"
        style={styles.inputStyle}
        placeholder={placeholder}
        onChangeText={setValue}
        maxLength={13}
      />
    </View>
  );
};

export default SignInField;

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
    width: "100%",
  },
  inputStyle: {
    flex: 1,
    // borderWidth: 2,
  },
});

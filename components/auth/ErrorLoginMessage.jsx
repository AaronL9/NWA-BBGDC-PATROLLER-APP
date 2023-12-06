import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const ErrorLoginMessage = ({ message }) => {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={24} color={Colors.errorText} />
      <Text style={styles.errorMessage}>{message}</Text>
    </View>
  );
};

export default ErrorLoginMessage;

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: Colors.errorsContainer,
    padding: 6,
    alignSelf: "flex-start",
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: '100%',
    borderRadius: 6,
  },
  errorMessage: {
    color: Colors.errorText,
  },
});

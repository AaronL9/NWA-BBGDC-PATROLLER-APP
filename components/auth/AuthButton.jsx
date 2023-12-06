import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "../../constants/colors";

const AuthButton = ({ title, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.buttonWrapper,
        pressed && styles.feedback,
      ]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: Colors.primary200,
    borderRadius: 6,
    paddingVertical: 8,
    marginVertical: 16,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  feedback: {
    opacity: 0.5,
  },
});

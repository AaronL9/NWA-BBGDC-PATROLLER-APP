import { StyleSheet, Text, View, TextInput } from "react-native";

export default function ProfileInfoEditor({
  setData,
  propKey,
  label,
  currentValue,
  isEditing,
}) {
  const disabledStyle = isEditing ? "black" : "#888888";
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.textInput, { borderColor: disabledStyle }]}
        value={currentValue}
        onChangeText={(value) =>
          setData((prev) => ({ ...prev, [propKey]: value }))
        }
        editable={isEditing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: { fontWeight: "bold" },
  textInput: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 1.5,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
});

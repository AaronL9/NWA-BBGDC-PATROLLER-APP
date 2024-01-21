import { Text, View, Button } from "react-native";
import { Colors } from "../constants/colors";

export default function Settings() {
  return (
    <>
      <View style={{ backgroundColor: Colors.primary400, flex: 1 }}>
        <Text>Settings</Text>
      </View>
    </>
  );
}

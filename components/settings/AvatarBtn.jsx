import { StyleSheet, Image, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function AvatarBtn({ uri }) {
  const src = uri ? { uri } : require("../../assets/profile-circle.png");
  return (
    <View style={styles.avatarContainer}>
      <Image
        style={{ width: 100, height: 100, borderRadius: 50 }}
        source={src}
      />
      <View style={styles.cameraContainer}>
        <Entypo style={styles.camera} name="camera" size={18} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  cameraContainer: {
    backgroundColor: "white",
    padding: 4,
    borderRadius: 50,
    position: "absolute",
    bottom: -4,
    right: -4,
  },
  camera: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 50,
  },
});

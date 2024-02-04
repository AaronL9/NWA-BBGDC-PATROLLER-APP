import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatCard({ name, uid }) {
  const navigation = useNavigation();
  return (
    <View style={{ backgroundColor: "white" }}>
      <Pressable
        android_ripple={{ color: "grey", foreground: true }}
        style={styles.container}
        onPress={() =>
          navigation.navigate("Chat", {
            adminId: uid,
          })
        }
      >
        <Image
          style={styles.image}
          source={require("../../assets/profile-circle.png")}
        />
        <View>
          <Text style={{ fontWeight: "bold" }}>{name}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  image: {
    width: 50,
    height: 50,
  },
  lastChat: {
    color: "#c3cfc8",
  },
});

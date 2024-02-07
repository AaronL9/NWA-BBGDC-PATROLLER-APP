import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";

export default function ChatCard({ name, uid }) {
  const navigation = useNavigation();
  return (
    <View style={styles.cardContainer}>
      <Pressable
        android_ripple={{ color: "grey", foreground: true }}
        style={styles.pressContainer}
        onPress={() =>
          navigation.navigate("Chat", {
            adminId: uid,
            chatTitle: name,
          })
        }
      >
        <Image
          style={styles.image}
          source={require("../../assets/profile-circle.png")}
        />
        <View>
          <Text style={{ fontWeight: "bold", color: "white" }}>{name}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.bgPrimary200,
    borderRadius: 8,
  },
  pressContainer: {
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

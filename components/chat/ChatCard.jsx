import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

export default function ChatCard({ name, roomId, adminId, lastMessage }) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const you = user.data.uid === lastMessage.id ? "You: " : "";

  const pressHandler = () => {
    navigation.navigate("Chat", {
      roomId,
      chatTitle: name,
      adminId,
    });
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable
        android_ripple={{ color: "grey", foreground: true }}
        style={styles.pressContainer}
        onPress={pressHandler}
      >
        <Image
          style={styles.image}
          source={require("../../assets/profile-circle.png")}
        />
        <View>
          <Text style={{ fontWeight: "bold", color: "white" }}>{name}</Text>
          <Text
            style={{ color: "white", fontWeight: 200 }}
          >{`${you} ${lastMessage.message}`}</Text>
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

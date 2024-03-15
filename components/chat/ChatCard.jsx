import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";

export default function ChatCard({
  name,
  roomId,
  adminId,
  lastMessage,
  avatarURL,
}) {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const you = user.data.uid === lastMessage.id ? "You: " : "";

  const pressHandler = () => {
    navigation.navigate("Chat", {
      roomId,
      chatTitle: name,
      adminId,
      avatarURL,
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
          source={
            avatarURL
              ? { uri: avatarURL }
              : require("../../assets/profile-circle.png")
          }
        />
        <View>
          <Text style={{ fontWeight: "bold", color: "black" }}>{name}</Text>
          <Text
            style={{ color: "black", fontWeight: 200 }}
          >{`${you} ${lastMessage.message}`}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  pressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  lastChat: {
    color: "#c3cfc8",
  },
});

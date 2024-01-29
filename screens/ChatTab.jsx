import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import ChatCard from "../components/chat/ChatCard";

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "admins"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setChatRooms(data);
    };
    fetchChatRooms();
  }, []);

  return (
    <View style={styles.rootContainer}>
      {chatRooms.map((chatRoom, index) => (
        <ChatCard
          key={index}
          name={`${chatRoom.firstName} ${chatRoom.lastName}`}
          uid={chatRoom.uid}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: 8,
    paddingHorizontal: 6,
    gap: 8,
  },
  tabContainer: {
    overflow: "hidden",
    backgroundColor: "transparent",
    shadowColor: "transparent",
  },
});

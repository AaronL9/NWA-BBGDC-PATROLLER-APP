import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useContext, useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebase";

import ChatCard from "../components/chat/ChatCard";
import { Colors } from "../constants/colors";
import { AuthContext } from "../context/authContext";

export default function ChatList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "rooms"),
        where("patroller.id", "==", user.data.uid),
        orderBy("updatedAt", "desc")
      ),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          admin: doc.data().admin,
        }));
        setRooms(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting documents: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.rootContainer}>
      <View>
        <Text style={styles.chatListTitle}>Chat with Admins</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#000000" />}
      {rooms.map((data) => (
        <ChatCard
          key={data.docId}
          name={data.admin.displayName}
          adminId={data.admin.id}
          roomId={data.docId}
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
  chatListTitle: {
    fontWeight: "bold",
    fontSize: 24,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary400,
    borderRightWidth: 6,
    borderRightColor: Colors.primary400,
    paddingLeft: 8,
    marginTop: 12,
    marginBottom: 20,
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    borderRadius: 4,
  },
});

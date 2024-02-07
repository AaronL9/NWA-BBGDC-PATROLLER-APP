import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

import ChatCard from "../components/chat/ChatCard";
import { Colors } from "../constants/colors";

export default function ChatList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "admins"), orderBy("order", "asc")),
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setAdmins(data);
        setLoading(false);
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
      {admins.map((admin, index) => (
        <ChatCard key={index} name={admin.displayName} uid={admin.uid} />
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

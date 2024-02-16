import React, {
  useState,
  useCallback,
  useContext,
  useLayoutEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  doc,
  setDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator, View, Text } from "react-native";

const locationMessage = [
  {
    _id: 1, // Unique message ID
    text: "hello tehre", // Optional: You can include a text message along with the location
    location: {
      latitude: 123.456, // Replace with the actual latitude
      longitude: 456.789, // Replace with the actual longitude
    },
    createdAt: new Date(), // Date when the message is created
    user: {
      _id: 1, // ID of the user who sent the message
      name: "John", // Name of the user who sent the message
    },
  },
];

export default function Chat({ route }) {
  const { user } = useContext(AuthContext);
  const { adminId } = route.params;
  const [messages, setMessages] = useState([]);
  const roomId = `${user.data.uid}_${adminId}`;

  useLayoutEffect(() => {
    const collectionRef = collection(db, "rooms", roomId, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            _id: doc.id,
            createdAt: data.createdAt.toDate(),
            text: data.text,
            user: data.user,
          };
        })
      );
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    console.log(_id, createdAt.toString());
    const nestedDocRef = doc(db, "rooms", roomId, "chats", _id);
    setDoc(nestedDocRef, {
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderLoading={() => <ActivityIndicator size={"large"} color={"black"} />}
      user={{
        _id: user.data.username,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}

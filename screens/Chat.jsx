import React, { useState, useCallback, useEffect, useContext } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../context/authContext";

export default function Chat() {
  const adminId = "sZn6iAa3IcNBhtgpofR2ykA1yRo2";
  const { user } = useContext(AuthContext);
  const roomId = user.data.uid + adminId;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "rooms", roomId, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, "rooms", roomId, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user.data.username,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}

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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator } from "react-native";

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

    const { _id, text, user } = messages[0];

    const nestedDocRef = doc(db, "rooms", roomId, "chats", _id);
    setDoc(nestedDocRef, {
      createdAt: serverTimestamp(),
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

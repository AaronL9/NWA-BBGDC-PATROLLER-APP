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
  const { roomId, adminId } = route.params;
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const collectionRef = collection(db, "rooms", roomId, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot?.docs[0]?.data()?.createdAt) return;
      const currentMessages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      }));
      setMessages(currentMessages);
    });
    return unsubscribe;
  }, [roomId]);

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, text, user } = messages[0];

    const nestedDocRef = doc(db, "rooms", roomId, "chats", _id);
    await setDoc(nestedDocRef, {
      createdAt: serverTimestamp(),
      text,
      user,
    });

    try {
      const response = await fetch(
        `https://${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/push/notify-admin`,
        {
          method: "POST",
          body: JSON.stringify({ adminId }),
          headers: {
            "Content-Type": "application/json",
            Authorization: user.token,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log(json);
      }

      console.log(json);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderLoading={() => <ActivityIndicator size={"large"} color={"black"} />}
      user={{
        _id: user.data.uid,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}

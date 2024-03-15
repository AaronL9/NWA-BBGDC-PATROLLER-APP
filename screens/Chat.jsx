import { useState, useCallback, useContext, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator } from "react-native";
import firestore from "@react-native-firebase/firestore";

export default function Chat({ route }) {
  const { user: currentUser } = useContext(AuthContext);
  const { roomId, adminId, avatarURL } = route.params;
  const [messages, setMessages] = useState([]);

  const url =
    avatarURL ??
    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg";

  useEffect(() => {
    const subscriber = firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("chats")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot?.docs[0]?.data()?.createdAt) return;
        const currentMessages = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          user: {
            ...doc.data().user,
            avatar: url,
          },
        }));
        setMessages(currentMessages);
      });

    return () => subscriber();
  }, [roomId]);

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, text, user } = messages[0];

    firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("chats")
      .doc(_id)
      .set({
        createdAt: firestore.FieldValue.serverTimestamp(),
        text,
        user,
      });

    fetch(
      `https://${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/push/notify-admin`,
      {
        method: "POST",
        body: JSON.stringify({ adminId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: currentUser.token,
        },
      }
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      renderLoading={() => <ActivityIndicator size={"large"} color={"black"} />}
      user={{
        _id: currentUser.data.uid,
      }}
    />
  );
}

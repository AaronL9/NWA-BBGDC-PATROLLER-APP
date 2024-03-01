import { useState, useCallback, useContext, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AuthContext } from "../context/authContext";
import { ActivityIndicator } from "react-native";
import firestore from "@react-native-firebase/firestore";

export default function Chat({ route }) {
  const { user: currentUser } = useContext(AuthContext);
  const { roomId, adminId } = route.params;
  const [messages, setMessages] = useState([]);

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

    try {
      const response = await fetch(
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
        _id: currentUser.data.uid,
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}

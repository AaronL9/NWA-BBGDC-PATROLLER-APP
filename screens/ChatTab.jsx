import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import { useWindowDimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { TabBar } from "react-native-tab-view";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import ChatCard from "../components/chat/ChatCard";

const SecondRoute = () => <View />;

const ChatList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(collection(db, "admins"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setAdmins(data);
    };
    fetchAdmins();
  }, []);

  console.log(admins);
  return (
    <View style={styles.rootContainer}>
      {admins.map((admin, index) => (
        <ChatCard
          key={index}
          name={`${admin.firstName} ${admin.lastName}`}
          uid={admin.uid}
        />
      ))}
    </View>
  );
};

const renderScene = SceneMap({
  first: ChatList,
  second: SecondRoute,
});

export default function ChatTab() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Chat" },
    { key: "second", title: "Group" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={(props) => (
        <TabBar
          style={styles.tabContainer}
          inactiveColor="#7f7f7f"
          activeColor="black"
          pressColor="transparent"
          labelStyle={{ fontWeight: "bold" }}
          indicatorStyle={{
            height: 30,
            borderRadius: 15,
            top: 9,
            backgroundColor: "black",
            opacity: 0.2,
          }}
          {...props}
        />
      )}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{ paddingTop: 15, paddingHorizontal: 15 }}
    />
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

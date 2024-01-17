import { useContext, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import Chat from "../screens/Chat";
import Settings from "../screens/Settings";
import { Colors } from "../constants/colors";
import { AuthContext } from "../context/authContext";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const authCtx = useContext(AuthContext);
  console.log(authCtx.userData);
  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1 }} {...props}>
      <View
        style={{
          marginVertical: 16,
          marginHorizontal: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Image
          source={require("../assets/profile-circle.png")}
          style={{ width: 35, height: 35 }}
        />
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {`${authCtx.userData.firstName} ${authCtx.userData.lastName}`}
        </Text>
        <View style={{ marginStart: "auto" }}>
          <Ionicons
            onPress={() => console.log("tap")}
            name="settings-outline"
            size={22}
            color={"white"}
          />
        </View>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        inactiveTintColor="white"
        style={{ marginTop: "auto", marginBottom: 12 }}
        icon={({ color, size }) => (
          <Ionicons name="exit-outline" size={size} color={color} />
        )}
        onPress={authCtx.logout}
      />
    </DrawerContentScrollView>
  );
}

export default function Home() {
  const authCtx = useContext(AuthContext);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    if (!!authCtx?.userData && !!authCtx?.userData?.docId) {
      console.log(authCtx.userData.docId);
      const patrolLocationRef = doc(db, "patrollers", authCtx.userData.docId);

      const startLocationTracking = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
          return;
        }

        const locationSubscriber = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 5000,
          },
          (newLocation) => {
            const newCoords = newLocation.coords;
            // Check if the location has changed
            if (
              !location ||
              location.latitude !== newCoords.latitude ||
              location.longitude !== newCoords.longitude
            ) {
              setLocation(newCoords);
              console.log(location);
              // Send location update to Firestore
              updateDoc(patrolLocationRef, {
                patrollerLocation: {
                  lat: newCoords.latitude,
                  lng: newCoords.longitude,
                },
              });
            }
          }
        );

        return () => {
          locationSubscriber.remove();
        };
      };

      startLocationTracking();
    } else {
      console.error("authCtx.userData or authCtx.userData.docId is undefined");
    }
  }, [authCtx.userData]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary400 },
        headerTintColor: "white",
        drawerStyle: {
          backgroundColor: Colors.primary400,
        },
        drawerInactiveTintColor: "white",
        drawerActiveTintColor: "black",
        drawerActiveBackgroundColor: "white",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="Chats"
        component={Chat}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

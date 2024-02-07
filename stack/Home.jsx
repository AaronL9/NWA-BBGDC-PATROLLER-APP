import { useContext, useLayoutEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import { db } from "../config/firebase";
import { Colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import Chat from "../screens/Chat";
import Settings from "../screens/Settings.jsx";
import LocationReport from "../screens/LocationReport.jsx";
import ChatTab from "../screens/ChatTab.jsx";
import PatrollerMap from "../screens/PatrollerMap.jsx";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const { user, authenticating, logout, avatar } = useContext(AuthContext);
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
          source={
            avatar ? { uri: avatar } : require("../assets/profile-circle.png")
          }
          style={{ width: 35, height: 35, borderRadius: 17.5 }}
        />
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {!authenticating && `${user.data.firstName} ${user.data.lastName}`}
        </Text>
        <View style={{ marginStart: "auto" }}>
          <Ionicons
            onPress={() => navigation.navigate("Settings")}
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
        onPress={logout}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
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
        sceneContainerStyle: { backgroundColor: "#faf9ff" },
      }}
    >
      <Drawer.Screen
        name="LocationReport"
        component={LocationReport}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
          drawerLabel: "Tracker",
          headerTitle: "Tracker",
        }}
      />
      <Drawer.Screen
        name="Chats"
        component={ChatTab}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function Home() {
  const { user, setPatrollerLocation } = useContext(AuthContext);
  const [location, setLocation] = useState(null);

  const isUserDataLoaded = !!user?.data && !!user?.data?.docId;

  useLayoutEffect(() => {
    if (isUserDataLoaded) {
      const patrolLocationRef = doc(db, "patrollers", user.data.docId);

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
              setPatrollerLocation({
                latitude: newCoords.latitude,
                longitude: newCoords.longitude,
              });
              console.log("My location: ", newCoords);
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
    }
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary400 },
        headerTintColor: "white",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({
          animation: "fade_from_bottom",
          headerTitle: route.params?.chatTitle,
          headerTitleStyle: { fontSize: 16 },
        })}
      />
      <Stack.Screen
        name="PatrollerMap"
        component={PatrollerMap}
        options={{ animation: "fade_from_bottom" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          animation: "fade_from_bottom",
          headerTitle: "Profile",
        }}
      />
    </Stack.Navigator>
  );
}

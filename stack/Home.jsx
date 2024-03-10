import { useContext, useEffect, useState } from "react";
import { View, Text, Image, Alert, Linking } from "react-native";
import { AuthContext } from "../context/authContext";
import { Colors } from "../constants/colors";

import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as TaskManager from "expo-task-manager";

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
import { truncateAndAddDots } from "../util/stringFormatter.js";

const LOCATION_TASK_NAME = "background-location-task";

const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
        timeInterval: 5000,
      });
    }
  }
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    try {
      const location = locations[0].coords;
      await AsyncStorage.setItem("device_location", JSON.stringify(location));
      if (location.accuracy < 4) {
        console.log("Background: ", location);
        const uid = await AsyncStorage.getItem("uid");
        firestore()
          .collection("patrollers")
          .doc(uid)
          .update({
            patrollerLocation: {
              lat: location.latitude,
              lng: location.longitude,
            },
          });
      }
    } catch (e) {
      console.log(e.message);
    }
  }
});

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const { user, authenticating, logout } = useContext(AuthContext);
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
            user?.data?.avatarUrl
              ? { uri: user.data.avatarUrl }
              : require("../assets/profile-circle.png")
          }
          style={{ width: 35, height: 35, borderRadius: 17.5 }}
        />
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
          {!authenticating &&
            truncateAndAddDots(`${user.data.firstName} ${user.data.lastName}`)}
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

  const isUserDataLoaded = !!user?.data && !!user?.data?.uid;

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (!isUserDataLoaded) return;

      firestore()
        .collection("device_push_token")
        .doc(user.data.uid)
        .set({ token }, { merge: true });
    });

    const subscription1 = Notifications.addNotificationReceivedListener(() => {
      console.log("NOTIFICATION RECEIVED HANDLED");
    });

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      () => {
        console.log("NOTIFICATION RESPONSE HANLDED");
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  useEffect(() => {
    let locationSubscriber;

    const startLocationTracking = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location to track your routes",
          [
            { text: "cancel" },
            { text: "Go to settings", onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      }

      locationSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 1,
          timeInterval: 5000,
        },
        (newLocation) => {
          const newCoords = newLocation.coords;
          if (newCoords.accuracy < 4) {
            setPatrollerLocation({
              latitude: newCoords.latitude,
              longitude: newCoords.longitude,
            });
            console.log("foreground: ", newCoords);
          }
        }
      );
    };

    const cleanup = () => {
      if (locationSubscriber) {
        locationSubscriber.remove();
      }
    };

    if (isUserDataLoaded) {
      startLocationTracking();

      return cleanup; // Cleanup when the component unmounts or dependencies change
    }

    // Cleanup when the user data is not loaded
    cleanup();
  }, [isUserDataLoaded, user]);

  useEffect(() => {
    requestPermissions();
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
        options={{
          headerTitle: "Patroller Map",
          animation: "fade_from_bottom",
        }}
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

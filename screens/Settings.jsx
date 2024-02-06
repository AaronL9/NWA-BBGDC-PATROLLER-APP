import { useContext, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../config/firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { renderers } from "react-native-popup-menu";

import AvatarBtn from "../components/settings/AvatarBtn";
import { AuthContext } from "../context/authContext";

const { SlideInMenu } = renderers;

const BottomMenu = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setAvatar, avatar } = useContext(AuthContext);

  const verifyMediaLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow the Files and Media permission in the app settings",
        [
          { text: "cancel" },
          { text: "Go to settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return true;
  };

  const pickMedia = async () => {
    const permission = await verifyMediaLibrary();
    if (!permission) return;

    setIsLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        try {
          const file = await fetch(uri);
          const blob = await file.blob();

          const storageRef = ref(
            storage,
            `patrollers/${user.data.uid}/profile_pic`
          );

          const snapshot = await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(snapshot.ref);
          setAvatar(downloadURL);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    } catch (error) {
      console.log(permission);
      console.log("Error while selecting file: ", error);
    }
    setIsLoading(false);
  };

  return (
    <View>
      <Menu name="numbers" renderer={SlideInMenu}>
        <MenuTrigger
          children={<AvatarBtn uri={avatar} />}
          customStyles={{
            triggerOuterWrapper: styles.triggerOuterStyle,
          }}
        />
        <MenuOptions
          customStyles={{
            optionsWrapper: styles.menuOptionsWrapperStyle,
            optionWrapper: { paddingVertical: 8 },
            optionText: { color: "white" },
          }}
        >
          <Text style={styles.menuOptionsTitle}>Change Profile Picture</Text>
          <MenuOption
            onSelect={() => alert("presesed")}
            children={
              <View style={styles.galleryIcon}>
                <Entypo name="camera" size={24} color="white" />
                <Text style={{ color: "white" }}>Take a photo</Text>
              </View>
            }
          />
          <MenuOption
            onSelect={pickMedia}
            children={
              <View style={styles.galleryIcon}>
                <Entypo name="images" size={24} color="white" />
                <Text style={{ color: "white" }}>Choose from gallery</Text>
              </View>
            }
          />
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default function Settings() {
  const { user } = useContext(AuthContext);
  return (
    <MenuProvider>
      <ScrollView>
        <BottomMenu />
        <Text
          style={styles.patrollerName}
        >{`${user.data.firstName} ${user.data.lastName}`}</Text>
      </ScrollView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  triggerOuterStyle: {
    justifyContent: "center",
    alignSelf: "center",
    width: 125,
    height: 125,
    borderRadius: 62.5,
    overflow: "hidden",
    padding: 4,
  },
  menuOptionsWrapperStyle: {
    backgroundColor: Colors.primary400,
    borderTopRightRadius: 16,
    borderTopStartRadius: 25,
    borderTopLeftRadius: 16,
    borderTopEndRadius: 25,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  menuOptionsTitle: {
    alignSelf: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  galleryIcon: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  patrollerName: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});

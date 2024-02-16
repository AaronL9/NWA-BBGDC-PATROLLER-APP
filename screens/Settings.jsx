import { useContext, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../config/firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

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
import ProfileInfoEditor from "../components/settings/ProfileInfoEditor";
import { trimObjectStrings } from "../util/stringFormatter";

const { SlideInMenu } = renderers;

const BottomMenu = () => {
  const { user, setUser } = useContext(AuthContext);

  const verifyCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log(status);
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "to access the camera please allow the camera permission in the app settings",
        [
          { text: "cancel" },
          { text: "Go to settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }

    return true;
  };

  const launchCamera = async () => {
    const permission = await verifyCameraPermission();

    if (!permission) return;

    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        onUploadProfilePicture(uri);
      }
    } catch (error) {
      console.log("Error while taking a picture: ", error);
    }
  };

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

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        onUploadProfilePicture(uri);
      }
    } catch (error) {
      console.log(permission);
      console.log("Error while selecting file: ", error);
    }
  };

  const onUploadProfilePicture = async (uri) => {
    try {
      const file = await fetch(uri);
      const blob = await file.blob();

      const storageRef = ref(
        storage,
        `patrollers/${user.data.uid}/profile_pic`
      );

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUser((prev) => ({
        ...prev,
        data: { ...prev.data, avatarUrl: downloadURL },
      }));

      const docRef = doc(db, "patrollers", user.data.uid);
      await setDoc(docRef, { avatarUrl: downloadURL }, { merge: true });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <View style={styles.bottomMenuContainer}>
      <Menu name="numbers" renderer={SlideInMenu}>
        <MenuTrigger
          children={<AvatarBtn uri={user.data.avatarUrl} />}
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
            onSelect={launchCamera}
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
  const { user, setUser } = useContext(AuthContext);
  const currentValue = {
    username: user.data.username,
    firstName: user.data.firstName,
    lastName: user.data.lastName,
    address: user.data.address,
  };
  const [isEditing, setIsEditing] = useState(false);
  const [patrollerData, setPatrollerData] = useState(currentValue);
  const [loading, setLoading] = useState(false);

  const onCancelHandler = () => {
    setIsEditing(false);
    setPatrollerData(currentValue);
  };
  const onUpdateHandler = async () => {
    setLoading(true);
    setIsEditing(false);
    const trimData = trimObjectStrings(patrollerData);
    try {
      const docRef = doc(db, "patrollers", user.data.uid);
      await setDoc(docRef, trimData, { merge: true });
      setUser((prev) => ({
        ...prev,
        data: { ...prev.data, ...patrollerData },
      }));
      Alert.alert(
        "Success",
        "Your profile details have been successfully saved."
      );
    } catch (error) {
      Alert.alert(
        "Something Went",
        "We Encountered an Issue While Saving Your Changes."
      );
      console.log("Error updating document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuProvider>
      <ScrollView>
        <BottomMenu />
        <View style={styles.editorContainer}>
          {loading ? (
            <ActivityIndicator color="black" size="large" />
          ) : isEditing ? (
            <View style={styles.actionIconContainer}>
              <Feather
                name="check"
                size={24}
                color="black"
                onPress={onUpdateHandler}
              />
              <Feather
                name="x"
                size={24}
                color="black"
                onPress={onCancelHandler}
              />
            </View>
          ) : (
            <Feather
              name="edit"
              size={26}
              color="black"
              style={{ alignSelf: "flex-end" }}
              onPress={() => setIsEditing(true)}
            />
          )}

          <ProfileInfoEditor
            setData={setPatrollerData}
            propKey="username"
            label="USERNAME"
            currentValue={patrollerData.username}
            isEditing={isEditing}
          />
          <ProfileInfoEditor
            setData={setPatrollerData}
            propKey="firstName"
            label="FIRST NAME"
            currentValue={patrollerData.firstName}
            isEditing={isEditing}
          />
          <ProfileInfoEditor
            setData={setPatrollerData}
            propKey="lastName"
            label="LAST NAME"
            currentValue={patrollerData.lastName}
            isEditing={isEditing}
          />
          <ProfileInfoEditor
            setData={setPatrollerData}
            propKey="address"
            label="ADDRESS"
            currentValue={patrollerData.address}
            isEditing={isEditing}
          />
        </View>
      </ScrollView>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  bottomMenuContainer: { marginTop: 8 },
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
  editorContainer: {
    gap: 20,
    paddingVertical: 6,
    width: "80%",
    alignSelf: "center",
  },
  actionIconContainer: { alignSelf: "flex-end", flexDirection: "row", gap: 12 },
});

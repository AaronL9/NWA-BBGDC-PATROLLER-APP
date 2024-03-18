import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

const verifyCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

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

export const launchCamera = async (setFiles, setIsLoading) => {
  const permission = await verifyCameraPermission();

  if (!permission) return;

  setIsLoading(true);
  try {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) setFiles((prev) => prev.concat(result.assets));
  } catch (error) {
    console.log("Error while taking a picture: ", error);
  }
  setIsLoading(false);
};

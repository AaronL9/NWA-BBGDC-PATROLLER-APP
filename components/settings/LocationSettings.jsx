import { StyleSheet, Text, Linking, TouchableOpacity } from "react-native";
import React from "react";

export default function LocationSettings() {
  return (
    <>
      <TouchableOpacity
        style={styles.LocationBtn}
        onPress={() => Linking.openSettings()}
      >
        <Text>Change location permission</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  LocationBtn: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginVertical: 6,
  },
});

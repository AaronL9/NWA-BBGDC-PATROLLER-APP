import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const Header = ({ customStyle, imageStyle }) => {
  return (
    <View style={[styles.headerContainer, customStyle]}>
      <Image
        style={imageStyle}
        source={require("../assets/logo.png")}
      />
      <Text style={styles.headerText}>Neighborhood Watch</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 5,
    // borderWidth: 2,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

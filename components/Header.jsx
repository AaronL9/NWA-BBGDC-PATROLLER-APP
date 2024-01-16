import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../constants/colors";

const Header = ({ customStyle, imageStyle }) => {
  return (
    <View style={[styles.headerContainer, customStyle]}>
      <Image style={imageStyle} source={require("../assets/logo.png")} />
      <View>
        <Text style={styles.headerText}>Neighborhood Watch</Text>
        <Text style={[styles.headerText, styles.bottomText]}>
          Patroller App
        </Text>
      </View>
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
  bottomText: {
    fontSize: 18,
    fontWeight: "200",
    borderLeftWidth: 2,
    paddingLeft: 12,
    borderColor: Colors.accent
  },
});

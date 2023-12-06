import { StyleSheet, ActivityIndicator, View} from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

export default Loader

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    backgroundColor: 'black',
    opacity: 0.5,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // borderWidth: 2,
  },
});
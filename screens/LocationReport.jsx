import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function LocationCard() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("PatrollerMap")}
      style={styles.locationCard}
    >
      <FontAwesome5 name="location-arrow" size={24} color="white" />
      <Text style={styles.locationText}>188 Las Vegas, Bonuan Gueset</Text>
    </TouchableOpacity>
  );
}

export default function LocationReport() {
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.bodyTitle}>Reported Location</Text>
      <View>
        <LocationCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
    gap: 32,
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "uppercase",
    borderBottomWidth: 4,
    width: "auto",
    alignSelf: "center",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#950714",
  },
  locationText: {
    color: "white",
  },
});

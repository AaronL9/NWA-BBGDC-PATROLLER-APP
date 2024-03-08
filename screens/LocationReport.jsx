import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

function LocationCard({ address, coords }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("PatrollerMap", { coords })}
      style={styles.locationCard}
    >
      <FontAwesome5 name="location-arrow" size={24} color="white" />
      <Text style={styles.locationText}>{address}</Text>
    </TouchableOpacity>
  );
}

export default function LocationReport() {
  const [liveLocation, setLiveLocation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firestore()
      .collection("live_location")
      .onSnapshot((querySnapshot) => {
        const locations = querySnapshot.docs.map((doc) => ({
          docID: doc.id,
          ...doc.data(),
        }));
        setLiveLocation(locations);
        setLoading(false);
      });

    return () => subscriber();
  }, []);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.bodyTitle}>Reported Location</Text>
      <View style={{ gap: 8, flex: 1 }}>
        {loading && <ActivityIndicator size="large" color="black" />}
        {liveLocation.map((data) => (
          <LocationCard
            key={data.docID}
            address={data.location}
            coords={data.coords}
          />
        ))}
        {liveLocation.length === 0 && (
          <View
            style={{
              alignSelf: "center",
            }}
          >
            <Text>No current forwared location</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    paddingTop: 16,
    paddingHorizontal: 8,
    gap: 32,
    flex: 1,
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

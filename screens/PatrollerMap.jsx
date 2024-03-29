// PatrollerMabp.js
import React, { useState, useContext, useEffect, useRef } from "react";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  MarkerAnimated,
  AnimatedRegion,
} from "react-native-maps";
import polyline from "@mapbox/polyline";
import { AuthContext } from "../context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const PatrollerMap = ({ navigation, route }) => {
  const markerRef = useRef(null);
  const { patrollerLocation } = useContext(AuthContext);
  const { coords } = route.params;

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialPatrollerCoordinates] = useState(
    new AnimatedRegion(patrollerLocation)
  );

  const renderRoute = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      const origin = `${patrollerLocation.latitude},${patrollerLocation.longitude}`;
      const destination = `${coords.lat},${coords.lng}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === "OK") {
        const points = data.routes[0].overview_polyline.points;
        const decodedCoordinates = polyline.decode(points);
        const routeCoordinates = decodedCoordinates.map((coord) => ({
          latitude: coord[0],
          longitude: coord[1],
        }));
        setRouteCoordinates(routeCoordinates);
      } else {
        alert("Error fetching directions:", data.status);
      }
    } catch (error) {
      alert("Error fetching directions:", error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await renderRoute();
    setRefreshing(false);
  };

  useEffect(() => {
    if (patrollerLocation) {
      renderRoute();
    }
  }, [patrollerLocation, refreshing]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleMarkerAnimation = (nextCoordinate, duration) => {
    const { latitude, longitude } = markerRef.current.props.coordinate;
    const oldCoordinate = { latitude, longitude };

    if (oldCoordinate !== nextCoordinate) {
      if (Platform.OS === "android") {
        markerRef.current.animateMarkerToCoordinate(nextCoordinate, duration);
      }
    }
  };

  useEffect(() => {
    if (markerRef.current) {
      handleMarkerAnimation(patrollerLocation, 500);
    }
  }, [patrollerLocation]);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: patrollerLocation?.latitude ?? 16.072164663721217,
        longitude: patrollerLocation?.longitude ?? 120.34181320353657,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      zoomEnabled
      mapType="hybrid"
      loadingEnabled
      provider={PROVIDER_GOOGLE}
    >
      {patrollerLocation && (
        <>
          <MarkerAnimated
            ref={markerRef}
            coordinate={initialPatrollerCoordinates}
            title="Patroller"
          />
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#3498db"
              strokeWidth={8}
            />
          )}
        </>
      )}
      <Marker
        title="Reported Location"
        coordinate={{
          latitude: coords.lat,
          longitude: coords.lng,
        }}
      />
    </MapView>
  );
};

export default PatrollerMap;

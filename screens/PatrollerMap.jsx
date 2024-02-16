// PatrollerMabp.js
import React, { useState, useContext, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import { AuthContext } from "../context/authContext";

const PatrollerMap = () => {
  const { patrollerLocation } = useContext(AuthContext);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const renderRoute = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;
      const origin = `${patrollerLocation.latitude},${patrollerLocation.longitude}`;
      const destination = `${16.04718626335265},${120.34235330268457}`;

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

  useEffect(() => {
    if (patrollerLocation) {
      renderRoute();
    }
  }, [patrollerLocation]);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: patrollerLocation?.latitude || 16.072164663721217,
        longitude: patrollerLocation?.longitude || 120.34181320353657,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      zoomEnabled
      mapType="hybrid"
    >
      {patrollerLocation && (
        <>
          <Marker coordinate={patrollerLocation} title="Patroller" />
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
        coordinate={{
          latitude: 16.04718626335265,
          longitude: 120.34235330268457,
        }}
        title="Reported Location"
      />
    </MapView>
  );
};

export default PatrollerMap;

// PatrollerMabp.js
import React, { useState, useContext, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "@mapbox/polyline";
import { AuthContext } from "../context/authContext";

const PatrollerMabp = () => {
  const { patrollerLocation } = useContext(AuthContext);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const renderRoute = async () => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_API_KEY; // Replace with your API key
      const origin = `${patrollerLocation.latitude},${patrollerLocation.longitude}`;
      const destination = `${16.071812312696814},${120.33697799415297}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );

      const data = await response.json();

      console.log(patrollerLocation);
      console.log("Directions API Response:", data);

      if (data.status === "OK") {
        const points = data.routes[0].overview_polyline.points;
        const decodedCoordinates = polyline.decode(points);
        const routeCoordinates = decodedCoordinates.map((coord) => ({
          latitude: coord[0],
          longitude: coord[1],
        }));
        setRouteCoordinates(routeCoordinates);
      } else {
        console.error("Error fetching directions:", data.status);
      }
    } catch (error) {
      console.error("Error fetching directions:", error.message);
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
        latitude: patrollerLocation?.latitude || 0,
        longitude: patrollerLocation?.longitude || 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
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
          latitude: 16.071812312696814,
          longitude: 120.33697799415297,
        }}
        title="Reported Location"
      />
    </MapView>
  );
};

export default PatrollerMabp;

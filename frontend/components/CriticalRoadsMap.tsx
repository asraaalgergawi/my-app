import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';  // Import Polyline here
import axios from 'axios';

type LatLng = { latitude: number; longitude: number };  // Define your own LatLng type

const CriticalRoadsMap = () => {
  const [roadCoordinates, setRoadCoordinates] = useState<LatLng[]>([]);  // Change to use LatLng[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8082/api/critical-roads')
      .then(res => {
        const csvData = res.data;
        const lines = csvData.split('\n');
        const coords: LatLng[] = [];  // Use LatLng[] instead of [number, number][]

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const [x, y] = line.split(',').map(Number);
          if (!isNaN(x) && !isNaN(y)) {
            coords.push({ latitude: y, longitude: x });  // Convert to { latitude, longitude }
          }
        }

        setRoadCoordinates(coords);  // Correct type for setState
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load road data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? 'google' : undefined}  // Conditional provider
        initialRegion={{
          latitude: 31.25,
          longitude: 34.75,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {roadCoordinates.length > 1 && (
          <Polyline
            coordinates={roadCoordinates}  // Now passing LatLng[] format
            strokeColor="red"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default CriticalRoadsMap;

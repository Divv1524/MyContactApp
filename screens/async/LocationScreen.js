import React, { useState } from 'react';
import { View, Text, PermissionsAndroid, Platform, Button } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission granted');
          startLocationTracking();
        } else {
          console.log('Permission denied');
        }
      } else {
        startLocationTracking(); // iOS permission is handled automatically
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Start watching location
  const startLocationTracking = () => {
    const id = Geolocation.watchPosition(
      (position) => {
        console.log('Position:', position);
        setLocation(position);
      },
      (error) => {
        console.log('Error:', error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
    setWatchId(id); // Save watchId to clear later
  };

  // Stop watching location
  const stopLocationTracking = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      console.log('Tracking stopped');
      setWatchId(null);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Tracking Location" onPress={requestLocationPermission} />
      <View style={{ height: 20 }} />
      <Button title="Stop Tracking Location" onPress={stopLocationTracking} />
      {location && (
        <Text style={{ marginTop: 30 }}>
          Latitude: {location.coords.latitude}{'\n'}
          Longitude: {location.coords.longitude}
        </Text>
      )}
    </View>
  );
};

export default LocationScreen;

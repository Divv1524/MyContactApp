// src/screens/LocationScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentLocation,
  setLocationError,
  setLocationLoading,
  setLocationTracking,
  clearLocationError,
} from '../redux/slice/locationSlice';
import LocationService from '../services/LocationService';

const SimpleMap = ({ location, style }) => {
  if (!location) {
    return (
      <View style={[style, styles.mapPlaceholder]}>
        <Text style={styles.mapPlaceholderText}>
          📡 Waiting for GPS fix...
        </Text>
      </View>
    );
  }

  return (
    <View style={[style, styles.mapContainer]}>
      <View style={styles.mapContent}>
        <View style={styles.pin} />
        <Text style={styles.coordinatesText}>
          Latitude: {location.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Longitude: {location.longitude.toFixed(6)}
        </Text>
        <Text style={styles.accuracyText}>
          Accuracy: ±{location.accuracy.toFixed(2)} m
        </Text>
        <Text style={styles.timestampText}>
          Last update: {new Date(location.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
};

async function requestPermissions() {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];
      if (Platform.Version >= 33) {
        permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      }
      await PermissionsAndroid.requestMultiple(permissions);
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  }
}


const LocationScreen = () => {
  const dispatch = useDispatch();
  const { currentLocation, isTracking, error, loading } = useSelector(
    (state) => state.location
  );
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    requestPermissions().then(() => {
    const unsubscribe = LocationService.subscribeToLocationUpdates((location) => {
      console.log('Location update received:', location);
      dispatch(setCurrentLocation(location));
    });

    unsubscribeRef.current = unsubscribe;
    handleGetCurrentLocation();
  });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      LocationService.unsubscribeFromLocationUpdates();
    };
  }, [dispatch]);

  const handleGetCurrentLocation = async () => {
    try {
      dispatch(setLocationLoading(true));
      dispatch(clearLocationError());

      const location = await LocationService.getCurrentLocation();
      dispatch(setCurrentLocation(location));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to fetch current location';
      dispatch(setLocationError(errorMessage));
      Alert.alert('Location Error', errorMessage);
    } finally {
      dispatch(setLocationLoading(false));
    }
  };

  const handleStartTracking = async () => {
    try {
      dispatch(setLocationLoading(true));
      dispatch(clearLocationError());

      const result = await LocationService.startLocationUpdates();
      dispatch(setLocationTracking(true));
      console.log('Location tracking started:', result);

      Alert.alert('Success', 'Location tracking is now active');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to start tracking';
      dispatch(setLocationError(errorMessage));
      Alert.alert('Tracking Error', errorMessage);
    } finally {
      dispatch(setLocationLoading(false));
    }
  };

  const handleStopTracking = async () => {
    try {
      dispatch(setLocationLoading(true));
      dispatch(clearLocationError());

      const result = await LocationService.stopLocationUpdates();
      dispatch(setLocationTracking(false));
      console.log('Location tracking stopped:', result);

      Alert.alert('Success', 'Location tracking has stopped');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to stop tracking';
      dispatch(setLocationError(errorMessage));
      Alert.alert('Tracking Error', errorMessage);
    } finally {
      dispatch(setLocationLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📍 Live Location Tracker</Text>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}
      </View>

      <SimpleMap location={currentLocation} style={styles.map} />

      <View style={styles.controlsContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGetCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>📡 Refresh</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              isTracking ? styles.dangerButton : styles.successButton,
            ]}
            onPress={isTracking ? handleStopTracking : handleStartTracking}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {isTracking ? '⛔ Stop' : '▶ Start'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {isTracking ? '🟢 Tracking Active' : '🔴 Tracking Inactive'}
          </Text>
          {currentLocation && (
            <Text style={styles.statusText}>
              Provider: {currentLocation.provider || 'Unknown'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#2563EB', padding: 20, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  errorContainer: { backgroundColor: '#DC2626', padding: 10, marginTop: 10, borderRadius: 5 },
  errorText: { color: 'white', textAlign: 'center' },
  map: { flex: 1, margin: 20, borderRadius: 12 },
  mapContainer: {
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
  },
  mapPlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9CA3AF',
    borderRadius: 12,
  },
  mapPlaceholderText: { fontSize: 16, color: '#6B7280', fontStyle: 'italic' },
  mapContent: { alignItems: 'center' },
  pin: {
    width: 22,
    height: 22,
    backgroundColor: '#DC2626',
    borderRadius: 11,
    marginBottom: 18,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  coordinatesText: { fontSize: 15, fontWeight: 'bold', color: '#1E40AF', marginVertical: 2 },
  accuracyText: { fontSize: 14, color: '#059669', marginVertical: 2 },
  timestampText: { fontSize: 12, color: '#6B7280', marginTop: 5 },
  controlsContainer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: { backgroundColor: '#2563EB' },
  successButton: { backgroundColor: '#10B981' },
  dangerButton: { backgroundColor: '#DC2626' },
  buttonText: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  statusContainer: { alignItems: 'center' },
  statusText: { fontSize: 15, color: '#374151', marginVertical: 2 },
});

export default LocationScreen;

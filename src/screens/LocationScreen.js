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
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentLocation,
  setLocationError,
  setLocationLoading,
  setLocationTracking,
  clearLocationError,
  addLocationLog,
  clearLogs,
} from '../redux/slice/locationSlice';
import LocationService from '../services/LocationService';
import MapView, { Marker } from 'react-native-maps';

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
  const { currentLocation, isTracking, error, loading, logs: locationHistory } = useSelector(
    (state) => state.location
  );
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    requestPermissions().then(() => {
      const unsubscribe = LocationService.subscribeToLocationUpdates((location) => {
        console.log('Location update received:', location);
        dispatch(setCurrentLocation(location));

        dispatch(addLocationLog({
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date(location.timestamp).toISOString(),
        }));
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
      dispatch(addLocationLog({
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(location.timestamp).toISOString(),
      }));
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

  //Export history to CSV
  const handleExportCSV = async () => {
    if (locationHistory.length === 0) {
      Alert.alert('No Data', 'No location history to export');
      return;
    }

    // Convert array → CSV string
    let csv = "latitude,longitude,timestamp\n";
    locationHistory.forEach((loc) => {
      csv += `${loc.latitude},${loc.longitude},${loc.timestamp}\n`;
    });

    // Save to file
    const path = `${RNFS.DownloadDirectoryPath}/location_log.csv`;
    try {
      await RNFS.writeFile(path, csv, 'utf8');
      console.log("CSV saved at:", path);

      // Share the file (optional)
      await Share.open({
        url: `file://${path}`,
        type: 'text/csv',
        filename: 'location_log',
      });
    } catch (err) {
      console.error("CSV Export Error:", err);
      Alert.alert('Error', 'Failed to export CSV');
    }
  };

  const handleClearLogs = () => {
    if (locationHistory.length === 0) {
      Alert.alert("No Logs", "There are no logs to clear.");
      return;
    }
    dispatch(clearLogs());
    Alert.alert("Success", "All location logs cleared.");
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

      <View style={styles.mapWrapper}>
        {currentLocation ? (
          <MapView
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            region={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="You are here"
            />
          </MapView>
        ) : (
          <View style={[styles.map, styles.mapPlaceholder]}>
            <Text style={styles.mapPlaceholderText}>📡 Waiting for GPS fix...</Text>
          </View>
        )}

        {/* Overlay pin & info */}
        {currentLocation && (
          <View style={styles.overlay}>
            <Text style={styles.coordinatesText}>
              Latitude: {currentLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude: {currentLocation.longitude.toFixed(6)}
            </Text>
            <Text style={styles.accuracyText}>
              Accuracy: ±{currentLocation.accuracy.toFixed(2)} m
            </Text>
            <Text style={styles.timestampText}>
              Last update: {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleGetCurrentLocation}disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>📡 Refresh</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isTracking ? styles.dangerButton : styles.successButton,]}
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

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.successButton]}onPress={handleExportCSV}>
            <Text style={styles.buttonText}>Export CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearLogs}>
            <Text style={styles.buttonText}>Clear File</Text>
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
  header: { backgroundColor: '#2563EB', padding: 20, paddingTop: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  errorContainer: { backgroundColor: '#DC2626', padding: 10, marginTop: 10, borderRadius: 5 },
  errorText: { color: 'white', textAlign: 'center' },
  mapWrapper: { flex: 1, margin: 20, borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
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
  overlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
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
  coordinatesText: { fontSize: 15, fontWeight: 'bold', color: 'white', marginVertical: 2 },
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
     maxWidth: '48%',
  },
  primaryButton: { backgroundColor: '#2563EB' },
  successButton: { backgroundColor: '#10B981' },
  dangerButton: { backgroundColor: '#DC2626' },
  buttonText: { color: 'white', fontSize: 15, fontWeight: 'bold' },
  statusContainer: { alignItems: 'center' },
  statusText: { fontSize: 15, color: '#374151', marginVertical: 2 },
});

export default LocationScreen;

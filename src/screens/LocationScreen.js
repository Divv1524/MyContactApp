// src/screens/LocationScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useDispatch, useSelector } from 'react-redux';
import { RefreshBtn, StartStopBtn, ExportCSVBtn, ClearFileBtn } from "../components/LocationButton";
import {
  setCurrentLocation,
  setLocationError,
  setLocationLoading,
  setLocationTracking,
  clearLocationError,
  addLocationLog,
  clearLogs,
} from '../redux/slice/locationSlices';
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
  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    requestPermissions().then(() => {
      // Sync native tracking state with Redux
      // LocationService.isTrackingActive()
      //   .then((active) => {
      //     dispatch(setLocationTracking(active));
      //     console.log("📡 Native tracking status:", active);
      //   })
      //   .catch((err) => {
      //     console.warn("Tracking check failed:", err);
      //     dispatch(setLocationTracking(false));
      //   });

      LocationService.syncTrackingState()
      .then(() => {
        // After syncing, check the actual tracking status
        return LocationService.isTrackingActive();
      })
      .then((active) => {
        dispatch(setLocationTracking(active));
        console.log("📡 Synced tracking status:", active);
      })
      .catch((err) => {
        console.warn("Tracking sync/check failed:", err);
        dispatch(setLocationTracking(false));
      });

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

  useEffect(() => {
    if (currentLocation) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(newRegion);
    }
  }, [currentLocation]);

  const handleGetCurrentLocation = async () => {
    try {
      dispatch(setLocationLoading(true));
      dispatch(clearLocationError());

      const location = await LocationService.getCurrentLocation();
      console.log("📍 Refreshed location:", location); 
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

    try {
      const path = `${RNFS.CachesDirectoryPath}/location_log.csv`;
      await RNFS.writeFile(path, csv, 'utf8');
      console.log("CSV saved at:", path);

      // Share the file (optional)
      await Share.open({
        url: `file://${path}`,
        type: 'text/csv',
        filename: 'location_log',
      });
    } catch (err) {
      if (err?.message?.includes('User did not share')) {
        console.log("Share cancelled by user");
        return; // don't show error alert
      }
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

  const handleZoom = (type) => {
    const factor = type === 'in' ? 0.5 : 2;
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * factor,
      longitudeDelta: region.longitudeDelta * factor,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
          }}>
            <View style={styles.container}>
              <View style={[styles.header, styles.headerWithStatusBar]}>
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
                    region={region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                  >
                    <Marker
                      coordinate={region}
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
                  <RefreshBtn loading={loading} onPress={handleGetCurrentLocation} />
                  <StartStopBtn loading={loading} isTracking={isTracking} onPress={isTracking ? handleStopTracking : handleStartTracking} />
                </View>

                <View style={styles.buttonRow}>
                  <ExportCSVBtn title="Export CSV" onPress={handleExportCSV} />
                  <ClearFileBtn title="Clear File" onPress={handleClearLogs} />
                </View>

                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>
                    {isTracking ? '🟢 Tracking Active' : '🔴 Tracking Inactive'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#2563EB', padding: 20, },
  headerWithStatusBar: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
  },
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
  statusContainer: { alignItems: 'center' },
  statusText: { fontSize: 15, color: '#374151', marginVertical: 2 },
});

export default LocationScreen;

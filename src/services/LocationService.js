// src/services/LocationService.js
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { NativeLocationModule } = NativeModules;

let locationEventEmitter = null;

// if (Platform.OS === 'android' && NativeLocationModule) {
//   locationEventEmitter = new NativeEventEmitter(NativeLocationModule);
// }

if (Platform.OS === 'android') {
  locationEventEmitter = new NativeEventEmitter();
}

class LocationService {
  static instance = null;
  // stores the reference to the event listener, so we can unsubscribe later.
  locationListener = null;

  constructor() {}

  static getInstance() {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

// Calls native function to start background location tracking.
// Returns a Promise, so you can await it.
// Throws an error if native module is missing.
  async startLocationUpdates() {
    if (!NativeLocationModule) {
      throw new Error('NativeLocationModule is not available');
    }
    return NativeLocationModule.startLocationUpdates();
  }

  async stopLocationUpdates() {
    if (!NativeLocationModule) {
      throw new Error('NativeLocationModule is not available');
    }
    return NativeLocationModule.stopLocationUpdates();
  }

  async getCurrentLocation() {
    if (!NativeLocationModule) {
      throw new Error('NativeLocationModule is not available');
    }
    return NativeLocationModule.getCurrentLocation();
  }
async isTrackingActive() {
    if (!NativeLocationModule) {
      throw new Error('NativeLocationModule is not available');
    }
    return NativeLocationModule.isTrackingActive();
  }

  // ADD THIS: Sync tracking state when app restarts
  async syncTrackingState() {
    if (!NativeLocationModule) {
      throw new Error('NativeLocationModule is not available');
    }
    return NativeLocationModule.syncTrackingState();
  }


  subscribeToLocationUpdates(callback) {
    if (!locationEventEmitter) {
      console.warn('Location event emitter is not available');
      return null;
    }

    this.locationListener = locationEventEmitter.addListener(
      'locationUpdate',
      callback
    );

    return () => {
      if (this.locationListener) {
        this.locationListener.remove();
        this.locationListener = null;
      }
    };
  }

  unsubscribeFromLocationUpdates() {
    if (this.locationListener) {
      this.locationListener.remove();
      this.locationListener = null;
    }
  }
}

export default LocationService.getInstance();

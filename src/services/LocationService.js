// src/services/LocationService.js
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { NativeLocationModule } = NativeModules;

let locationEventEmitter = null;

if (Platform.OS === 'android' && NativeLocationModule) {
  locationEventEmitter = new NativeEventEmitter(NativeLocationModule);
}

class LocationService {
  static instance = null;
  locationListener = null;

  constructor() {}

  static getInstance() {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

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

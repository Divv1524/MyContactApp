package com.generalapp

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Bundle
import android.os.Looper
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class NativeLocationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LocationListener {

    private var locationManager: LocationManager? = null
    private var lastKnownLocation: Location? = null
    private val MIN_DISTANCE_CHANGE_FOR_UPDATES = 1f // meters
    private val NOTIFICATION_ID = 101
    private val MIN_TIME_BW_UPDATES = 10000L // ms
    private val CHANNEL_ID = "location_channel_id"

    companion object {
        const val NAME = "NativeLocationModule"
        const val LOCATION_UPDATE_EVENT = "locationUpdate"
        const val TAG = "NativeLocationModule"
    }

    override fun getName(): String = NAME

    init {
        setupLocationManager()
        createNotificationChannel()
    }

    private fun setupLocationManager() {
        try {
            locationManager = reactApplicationContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        } catch (e: Exception) {
            Log.e(TAG, "Error setting up LocationManager", e)
        }
    }

    @ReactMethod
    fun startLocationUpdates(promise: Promise) {
        try {
            if (locationManager == null) {
                promise.reject("LOCATION_MANAGER_NULL", "LocationManager is null")
                return
            }

            if (!hasLocationPermission()) {
                promise.reject("PERMISSION_DENIED", "Location permission not granted")
                return
            }

            val isGPSEnabled = locationManager!!.isProviderEnabled(LocationManager.GPS_PROVIDER)
            val isNetworkEnabled = locationManager!!.isProviderEnabled(LocationManager.NETWORK_PROVIDER)

            if (!isGPSEnabled && !isNetworkEnabled) {
                promise.reject("LOCATION_DISABLED", "No location provider enabled")
                return
            }

            if (isGPSEnabled) {
                locationManager!!.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    MIN_TIME_BW_UPDATES,
                    MIN_DISTANCE_CHANGE_FOR_UPDATES,
                    this,
                    Looper.getMainLooper()
                )
            }

            if (isNetworkEnabled) {
                locationManager!!.requestLocationUpdates(
                    LocationManager.NETWORK_PROVIDER,
                    MIN_TIME_BW_UPDATES,
                    MIN_DISTANCE_CHANGE_FOR_UPDATES,
                    this,
                    Looper.getMainLooper()
                )
            }

            getLastKnownLocation()
            sendOrUpdateLocationNotification(lastKnownLocation)
            promise.resolve("Location updates started")
            Log.d(TAG, "Location updates started")

        }

        catch (e: Exception) {
            Log.e(TAG, "Error starting location updates", e)
            promise.reject("START_LOCATION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopLocationUpdates(promise: Promise) {
        try {
            locationManager?.removeUpdates(this)
            NotificationManagerCompat.from(reactApplicationContext).cancel(NOTIFICATION_ID)
            promise.resolve("Location updates stopped")
            Log.d(TAG, "Location updates stopped")
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping location updates", e)
            promise.reject("STOP_LOCATION_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        try {
            getLastKnownLocation()
            if (lastKnownLocation != null) {
                promise.resolve(locationToMap(lastKnownLocation!!))
            } else {
                promise.reject("NO_LOCATION", "No location available")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting current location", e)
            promise.reject("GET_LOCATION_ERROR", e.message)
        }
    }

    private fun getLastKnownLocation() {
        try {
            if (locationManager != null) {
                val gpsLocation = locationManager!!.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                val networkLocation = locationManager!!.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)

                lastKnownLocation = when {
                    gpsLocation != null && networkLocation != null ->
                        if (gpsLocation.accuracy < networkLocation.accuracy) gpsLocation else networkLocation
                    gpsLocation != null -> gpsLocation
                    networkLocation != null -> networkLocation
                    else -> null
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting last known location", e)
        }
    }

    private fun sendLocationUpdate(location: Location) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(LOCATION_UPDATE_EVENT, locationToMap(location))

            Log.d(TAG, "Location update sent: ${location.latitude}, ${location.longitude}")
        } catch (e: Exception) {
            Log.e(TAG, "Error sending location update", e)
        }
    }

    private fun sendOrUpdateLocationNotification(location: Location?) {
        val contentText = if (location != null) {
            "Lat: ${location.latitude}, Lon: ${location.longitude}"
        } else {
            "Waiting for location..."
        }

        val notification = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentTitle("Live Location Tracking")
            .setContentText(contentText)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setOngoing(true)
            .build()

        with(NotificationManagerCompat.from(reactApplicationContext)) {
            notify(NOTIFICATION_ID, notification)
        }
    }


    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Location Updates"
            val descriptionText = "Channel for location update notifications"
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager: NotificationManager =
                reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun locationToMap(location: Location): WritableMap {
        return Arguments.createMap().apply {
            putDouble("latitude", location.latitude)
            putDouble("longitude", location.longitude)
            putDouble("accuracy", location.accuracy.toDouble())
            putDouble("timestamp", location.time.toDouble())
            putString("provider", location.provider ?: "unknown")
        }
    }

    private fun hasLocationPermission(): Boolean {
        val ctx = reactApplicationContext
        return ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
               ActivityCompat.checkSelfPermission(ctx, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    // LocationListener overrides
    override fun onLocationChanged(location: Location) {
        Log.d(TAG, "Location changed: ${location.latitude}, ${location.longitude}")
        if (shouldUpdateLocation(location)) {
            lastKnownLocation = location
            sendLocationUpdate(location)
            sendOrUpdateLocationNotification(location)
        }
    }

    private fun shouldUpdateLocation(newLocation: Location): Boolean {
        return lastKnownLocation?.distanceTo(newLocation)?.let { it >= MIN_DISTANCE_CHANGE_FOR_UPDATES } ?: true
    }

    @Deprecated("Deprecated in API level 29")
    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}

    override fun onProviderEnabled(provider: String) {
        Log.d(TAG, "Provider enabled: $provider")
    }

    override fun onProviderDisabled(provider: String) {
        Log.d(TAG, "Provider disabled: $provider")
    }
}
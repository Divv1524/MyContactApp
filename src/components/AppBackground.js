// AppBackground.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const AppBackground = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
    <View style={styles.fullBackground}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
      <View style={styles.circle4} />
      <View style={styles.circle5} />
      <View style={styles.circle6} />
      <View style={styles.circle7} />
    </View>

    <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#cfe9ff',
  },
  circle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: 50,
    left: 30,
  },
  circle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.25)',
    top: 120,
    right: 40,
  },
  circle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    bottom: 50,
    left: 60,
  },
  circle4: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    bottom: 100,
    right: 50,
  },
  circle5: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.15)',
    top: '30%',
    left: '10%',
  },
  circle6: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: '55%',
    right: '20%',
  },
  circle7: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: '50%',
    left: '40%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 25,
  },
});

export default AppBackground;

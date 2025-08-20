import { View, StyleSheet, Platform, Image, Animated } from 'react-native';
import React, { useEffect , useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Intro = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);

  // Keeps the animated value persistent across re-renders.
  const scaleAnim = useRef(new Animated.Value(0)).current; // initial scale 0

  useEffect(() => {
    // Animate the icon
    Animated.timing(scaleAnim, {
      toValue: 1, // scales the logo to its full size.
      duration: 1000, // 1 second
      useNativeDriver: true, //runs animation on native thread for better performance.
    }).start();
  
  const timeout = setTimeout(() => {
    if (user) {
      navigation.replace('MainTabs', { screen: 'Contact' });
    } else {
      navigation.replace('Login');
    }
  }, 3000);
  // Clean up the timer when component unmounts
  return () => clearTimeout(timeout);
}, [user]);  // Rerun this effect if user state changes

  return (
    <View style={styles.container}>
      <Animated.Image
          source={require('../assets/icon.png')} 
          style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
          resizeMode="cover"
        />
    </View>
  );
};

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Import Redux hook

const Intro = () => {
  const navigation = useNavigation();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Get login status from Redux

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace('Contact'); // Navigate to Contact if logged in
      } else {
        navigation.replace('Login'); // Navigate to Login if not
      }
    }, 3000);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Contact</Text>
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
});

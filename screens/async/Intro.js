import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'; // Import Redux hook

const Intro = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);

useEffect(() => {
  const timeout = setTimeout(() => {
    if (user) {
      navigation.replace('Contact');
    } else {
      navigation.replace('Login');
    }
  }, 3000);
  // Clean up the timer when component unmounts
  return () => clearTimeout(timeout);
}, [user]);  // Rerun this effect if user state changes

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

// App.js
import React, { Profiler } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Intro from './src/screens/Intro';
import SignUp from './src/screens/Signup';
import Login from './src/screens/Login';
import Contact from './src/screens/Contact';
import AddContact from './src/screens/AddContact';
import News from './src/screens/News';
import LocationScreen from './src/screens/LocationScreen';
import Profile from './src/screens/Profile';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs (Contacts, News, Location)
const MainTabs = () => {
  const user = useSelector(state => state.auth.user);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Contact') {
            iconName = 'people';
          } else if (route.name === 'News') {
            iconName = 'newspaper';
          } else if (route.name === 'Location') {
            iconName = 'location';
          }else if (route.name === 'Profile') {
            return user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
              />
            ) : (
              <Ionicons name="person" size={size} color={color} />
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Contact" component={Contact} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="Location" component={LocationScreen} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        
        {/* After login, user goes here */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />

        {/* AddContact will still be stack-based (opened from Contacts tab) */}
        <Stack.Screen name="AddContact" component={AddContact} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

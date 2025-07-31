import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/async/Login';
import Contact from './screens/async/Contact';
import AddContact from './screens/async/AddContact';
import Intro from './screens/async/Intro';
import SignUp from './screens/async/Signup';
import { AuthProvider } from './context/AuthContext';




const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro">
          <Stack.Screen
            name="Intro"
            component={Intro}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Contact"
            component={Contact}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddContact"
            component={AddContact}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

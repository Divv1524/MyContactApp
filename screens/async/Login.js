import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const saveEmailPass= async()=>{
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter both email and password');
      return;
    }
    try{
        await AsyncStorage.setItem('EMAIL', email)
        await AsyncStorage.setItem('PASSWORD', password)
        navigation.navigate('Contact');
    }
    catch(e)
    {
        console.log(e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        onChangeText={txt => setEmail(txt)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={txt =>setPassword(txt)}
      />

      <TouchableOpacity style={styles.button} onPress={() =>{saveEmailPass()}}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#e9f5f8',
  },
  title: {
    alignSelf:'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 100,
    fontWeight:'600',
    
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 50,
    width:'90%',
    borderColor: 'black',
    borderWidth: 2,
    alignSelf:'center',
    marginTop: 50,
    paddingLeft: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor:'#80c3d8',
    height:50,
    width:'90%',
    borderRadius: 20,
    alignSelf:'center',
    marginTop: 30,
    justifyContent:'center'

  }
});

export default Login;

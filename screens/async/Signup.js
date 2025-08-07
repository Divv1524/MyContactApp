import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/slice/authSlices';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Dispatch signUp thunk to handle async API logic
    dispatch(
      signUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      })
    )
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('Login');
      })
      .catch((err) => {
        Alert.alert('Signup Failed', err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.text}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#e9f5f8' },
  title: { fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, marginVertical: 10, padding: 10 },
  button: { backgroundColor: '#80c3d8', padding: 15, borderRadius: 10, marginTop: 20 },
  text: { textAlign: 'center', fontWeight: 'bold' },
  link: { marginTop: 15, textAlign: 'center', color: 'blue' },
});

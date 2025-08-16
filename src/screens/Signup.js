import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signUp } from '../redux/slice/authSlices';


const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Permission request for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS automatically asks
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const takePhoto = async () => {

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }

    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleSignUp = async() => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
    // Save profile image permanently with key = email
     if (profileImage) {
      await AsyncStorage.setItem(`profile_${email.trim().toLowerCase()}`, profileImage);
    }

    // Dispatch signUp thunk to handle async API logic
    dispatch(
      signUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        profileImage
      })
    )
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('Login');
      })
    }
      catch(err) {
        Alert.alert('Signup Failed', err);
      }
    };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TouchableOpacity onPress={chooseImage} style={{ alignSelf: 'center' }}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../assets/default-avatar.png')
          }
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ textAlign: 'center', marginTop: 5 }}>Upload Photo</Text>
      </TouchableOpacity>

      <Button title="Take Photo" onPress={takePhoto} />

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

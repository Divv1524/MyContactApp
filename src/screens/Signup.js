import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { signUp } from '../redux/slice/authSlices';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const input = useRef();
  const dispatch = useDispatch();

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
    return true;
  };

  const dismissFocus = () => {
    input.current?.blur();
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

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      Alert.alert('Error', 'Name should only contain letters and spaces');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      if (profileImage) {
        await AsyncStorage.setItem(`profile_${email.trim().toLowerCase()}`, profileImage);
      }

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
        });
    }
    catch (err) {
      Alert.alert('Signup Failed', err);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fcff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={() => {
            dismissFocus();
            Keyboard.dismiss();
          }}>
            <View style={styles.container}>
              <Text style={styles.title}>Create Your Account</Text>

              <TouchableOpacity onPress={chooseImage} style={styles.avatarContainer}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require('../assets/default-avatar.png')
                  }
                  style={styles.avatar}
                />
                <Text style={styles.uploadText}>Upload Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
                <Text style={styles.secondaryButtonText}>📷 Take Photo</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fcff',
  },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', alignSelf: 'center', marginBottom: 30, color: '#333' },

  avatarContainer: { alignSelf: 'center', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: '#80c3d8' },
  uploadText: { marginTop: 5, fontSize: 13, color: '#555' },

  secondaryButton: {
    backgroundColor: '#e3f6fb',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  secondaryButtonText: { color: '#0077b6', fontWeight: '600' },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    paddingLeft: 15,
    color: '#000',
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },

  button: {
    backgroundColor: '#80c3d8',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { textAlign: 'center', fontWeight: 'bold', color: '#fff', fontSize: 16 },

  link: { marginTop: 18, textAlign: 'center', color: '#0077b6', fontSize: 14 },
});

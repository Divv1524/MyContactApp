import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { login } from '../redux/slice/authSlices';

const Login = () => {
  const dispatch = useDispatch(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const savedUser = useSelector(state => state.auth.user);
  const navigation = useNavigation();
  const input = useRef();
  const [typedUser, setTypedUser] = useState(null);

  const dismissFocus = () => {
    input.current?.blur();
  };
// Whenever email changes, check if we have an image saved for it
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (email) {
        try {
          const savedImage = await AsyncStorage.getItem(`profile_${email}`);
          if (savedImage) {
            setTypedUser({ profileImage: savedImage });
          } else {
            setTypedUser(null);
          }
        } catch (err) {
          console.log("Error fetching image:", err);
        }
      } else {
        setTypedUser(null);
      }
    };
    fetchProfileImage();
  }, [email]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Please enter email and password');
      return;
    }
    //unwrap() is a helper function provided by Redux Toolkit (RTK) to convert the thunk result into a normal JavaScript Promise.
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        Alert.alert('Welcome!');
        navigation.replace('MainTabs'); // fixed to go into Tabs instead of only Contact
      })
      .catch((err) => Alert.alert('Login Failed', err));
  };

  // Decide which image to show: 
  // 1. If user is typing email and match found -> typedUser.profileImage 
  // 2. Else fallback to last logged in user
  const profileImage = typedUser?.profileImage || savedUser?.profileImage;

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#f9fcfe" />
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
    <TouchableWithoutFeedback onPress={() => {
      dismissFocus();
      Keyboard.dismiss();
    }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={styles.avatar}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={txt => setEmail(txt)}
          ref={input}
          placeholderTextColor="#999"
        />

        <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={txt => setPassword(txt)}
          ref={input}
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>
            Don’t have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    </ScrollView>
    </KeyboardAvoidingView>
    </>

  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9fcfe',
  },
  title: {
    alignSelf: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  avatar: {
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    alignSelf: 'center', 
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#80c3d8'
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 15,
    paddingLeft: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
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
    width: '90%',
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
    height: 50,
    width: '90%',
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  linkHighlight: {
    color: '#007AFF',
    fontWeight: '600',
  }
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';



const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const input = useRef();

    const dismissFocus = () => {
        input.current?.blur();
        input.current?.blur();
    };


    const handleLogin = async () => {
        const storedEmail = await AsyncStorage.getItem('EMAIL');
        const storedPassword = await AsyncStorage.getItem('PASSWORD');
        console.log('Stored Email:', storedEmail);
        console.log('Stored Password:', storedPassword);
        console.log('Entered Email:', email);
        console.log('Entered Password:', password);
        if (email.trim() === storedEmail && password.trim() === storedPassword) {
            await login();
            // await AsyncStorage.setItem('LOGIN_STATUS', 'true');
            Alert.alert('Welcome!');
            navigation.replace('Contact');
        } else {
            Alert.alert('Login Failed', 'Invalid credentials');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => {
            dismissFocus();
            Keyboard.dismiss();  // Also hides keyboard
        }}>
            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={txt => setEmail(txt)}
                    ref={dismissFocus}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    secureTextEntry
                    value={password}
                    onChangeText={txt => setPassword(txt)}
                    ref={dismissFocus}
                />

                <TouchableOpacity style={styles.button} onPress={() => { handleLogin() }}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={{ marginTop: 20, color: 'blue' }}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Login;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#e9f5f8',
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 100,
        fontWeight: '600',

    },
    text: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 50,
        width: '90%',
        borderColor: 'black',
        borderWidth: 2,
        alignSelf: 'center',
        marginTop: 50,
        paddingLeft: 20,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#80c3d8',
        height: 50,
        width: '90%',
        borderRadius: 20,
        alignSelf: 'center',
        marginTop: 30,
        justifyContent: 'center'

    }
});



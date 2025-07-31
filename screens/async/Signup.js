import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();
        try {
            await AsyncStorage.setItem('EMAIL', trimmedEmail);
            await AsyncStorage.setItem('PASSWORD', trimmedPassword);
            console.log('Stored Email:', trimmedEmail);
            console.log('Stored Password:', trimmedPassword);
            Alert.alert('Success', 'Account created successfully');
            navigation.navigate('Login');
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
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



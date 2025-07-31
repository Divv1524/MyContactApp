import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Intro = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            checkLogin();
        }, 3000);
    }, []);

    const checkLogin = async () => {
        try {
            const loginStatus = await AsyncStorage.getItem('LOGIN_STATUS');

            if (loginStatus === 'true') {
                navigation.replace('Contact'); // User is logged in
            } else {
                navigation.replace('Login'); // User is logged out
            }
        } catch (err) {
            console.log('AsyncStorage error:', err);
            navigation.replace('Login');
        }
    };


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

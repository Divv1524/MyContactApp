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
        const email = await AsyncStorage.getItem('EMAIL');
        const pass = await AsyncStorage.getItem('PASSWORD');
        if (email !== null) {
            navigation.navigate('Contact');
        }
        else {
            navigation.navigate('Login');
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Contact</Text>
        </View>
    );
};

export default Intro;

const styles = StyleSheet.create({
    container: {
        flex: 1,                // take full screen
        justifyContent: 'center', // center vertically
        alignItems: 'center',     // center horizontally
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});



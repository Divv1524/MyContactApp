import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, PermissionsAndroid, Platform, StatusBar, Image } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../redux/slice/authSlices';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [editing, setEditing] = useState(false);

    // Camera & Gallery handlers remain the same
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera access to take photos',
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
        return true; // iOS automatically handles it
    };

    const handleImagePicker = async () => {
        Alert.alert(
            "Choose Image",
            "Pick an option",
            [
                {
                    text: "Camera",
                    onPress: async () => {
                        const hasPermission = await requestCameraPermission();
                        if (!hasPermission) {
                            Alert.alert('Permission denied', 'Cannot open camera without permission');
                            return;
                        }

                        launchCamera(
                            { mediaType: 'photo', saveToPhotos: true },
                            async (response) => {
                                if (response.didCancel) return;
                                if (response.errorCode) {
                                    Alert.alert("Error", response.errorMessage || "Something went wrong");
                                    return;
                                }
                                const uri = response.assets?.[0]?.uri;
                                if (uri) {
                                    await AsyncStorage.setItem(`profile_${user?.email}`, uri);
                                    dispatch(updateProfile({ ...user, profileImage: uri }));
                                }
                            }
                        );
                    }
                },
                {
                    text: "Gallery",
                    onPress: () => {
                        launchImageLibrary(
                            { mediaType: 'photo' },
                            async (response) => {
                                if (response.didCancel) return;
                                if (response.errorCode) {
                                    Alert.alert("Error", response.errorMessage || "Something went wrong");
                                    return;
                                }
                                const uri = response.assets?.[0]?.uri;
                                if (uri) {
                                    await AsyncStorage.setItem(`profile_${user?.email}`, uri);
                                    dispatch(updateProfile({ ...user, profileImage: uri }));
                                }
                            }
                        );
                    }
                },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    const handleSave = async () => {
        if (!name && !email && !password) {
            Alert.alert('Error', 'Please enter something to update');
            return;
        }

        if (user?.email && user.email !== email) {
            const oldKey = `profile_${user.email}`;
            const newKey = `profile_${email}`;

            if (user?.profileImage) {
                await AsyncStorage.setItem(newKey, user.profileImage);
                await AsyncStorage.removeItem(oldKey);
            }
        } else if (user?.profileImage) {
            await AsyncStorage.setItem(`profile_${email}`, user.profileImage);
        }

        dispatch(
            updateProfile({
                name: name || user?.name,
                email: email || user?.email,
                password: password || user?.password,
                profileImage: user?.profileImage || null,
            })
        );
        Alert.alert('Success', 'Profile updated successfully!');
        setEditing(false);
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Full-screen gradient background */}
            <View style={styles.fullBackground}>
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />
                <View style={styles.circle4} />
                <View style={styles.circle5} />
                <View style={styles.circle6} />
                <View style={styles.circle7} />
            </View>

            <View style={styles.headerContainer}>
                <Text style={styles.heading}>My Profile</Text>
            </View>

            <View style={styles.container}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={
                            user?.profileImage
                                ? { uri: user.profileImage }
                                : require('../assets/default-avatar.png')
                        }
                        style={styles.profileImage}
                    />
                    {editing && (
                        <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
                            <Ionicons name="pencil" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Name */}
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={[styles.input, !editing && styles.disabledInput]}
                    placeholder={user?.name || 'Enter name'}
                    value={editing ? name : ''}
                    onChangeText={setName}
                    editable={editing}
                    placeholderTextColor="#999"
                />

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={[styles.input, !editing && styles.disabledInput]}
                    placeholder={user?.email || 'Enter email'}
                    value={editing ? email : ''}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    editable={editing}
                    placeholderTextColor="#999"
                />

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, !editing && styles.disabledInput]}
                        placeholder={user?.password ? '********' : 'Enter password'}
                        value={editing ? password : ''}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={editing}
                        placeholderTextColor="#999"
                    />
                    {editing && (
                        <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#333"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    {!editing ? (
                        <TouchableOpacity style={styles.button} onPress={() => {
                            setName(user?.name || '');
                            setEmail(user?.email || '');
                            setPassword(user?.password || '');
                            setEditing(true);
                        }}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    );
};

export default Profile;

const styles = StyleSheet.create({
    fullBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#cfe9ff',
    },
    circle1: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.3)',
        top: 50,
        left: 30,
    },
    circle2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.25)',
        top: 120,
        right: 40,
    },
    circle3: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.2)',
        bottom: 50,
        left: 60,
    },
    circle4: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.15)',
        bottom: 100,
        right: 50,
    },
    circle5: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.15)',
        top: '30%',
        left: '10%',
    },
    circle6: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: '55%',
        right: '20%',
    },
    circle7: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: '50%',
        left: '40%',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'transparent', // keep gradient visible
    },
    headerContainer: {
        backgroundColor: 'transparent',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
        paddingBottom: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 25,
        color: '#222',
        textAlign: 'center',
    },
    imageContainer: {
    alignSelf: 'center',
    marginVertical: 20,
    position: 'relative',
    borderWidth: 4,              // new: thickness of dark blue border
    borderColor: '#003366',      // new: dark blue color
    borderRadius: 70,            // must be half of image + border to make perfect circle
    padding: 4,                  // optional: some spacing between image and border
},
profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
},

    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'tomato',
        borderRadius: 15,
        padding: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#444',
    },
    passwordContainer: {
        position: 'relative',
        marginTop: 5,
        width: '100%',
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
        padding: 5,
    },
    input: {
        width: '100%',
        fontSize: 16,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    disabledInput: {
        backgroundColor: '#e9e9e9',
        color: '#666',
    },
    buttonRow: {
        marginTop: 30,
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'tomato',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

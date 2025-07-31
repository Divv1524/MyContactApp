import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Contacts from 'react-native-contacts';

const AddContact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();

  const requestPermission = async () => {
  if (Platform.OS === 'android') {
    const writeGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'App needs permission to save contacts to your device',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    const readGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Read Contacts Permission',
        message: 'App needs permission to read contacts from your device',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    return (
      writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
      readGranted === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};
  const validateMobile = (number) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(number);
  };

  const saveContact = async () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }

    if (!validateMobile(mobile)) {
      Alert.alert('Invalid Mobile Number', 'Enter a valid 10-digit number.');
      return;
    }

    try {
      const granted = await requestPermission();
      if (!granted) {
        console.log('WRITE_CONTACTS permission denied');
        Alert.alert('Permission Denied', 'Cannot save contact without permission');
        return;
      }

      const existingContacts = JSON.parse(await AsyncStorage.getItem('CONTACTS')) || [];
      const duplicate = existingContacts.find((contact) => contact.mobile === mobile);
      if (duplicate) {
        Alert.alert('Duplicate Contact', 'A contact with this mobile number already exists.');
        return;
      }

      const newContact = { name, mobile };
      const updatedContacts = [...existingContacts, newContact];
      await AsyncStorage.setItem('CONTACTS', JSON.stringify(updatedContacts));
      console.log('Contact saved in app:', newContact);

      // Save to device
      const contactToSave = {
        givenName: name,
        phoneNumbers: [{ label: 'mobile', number: mobile }],
      };

      await Contacts.addContact(contactToSave)
        .then(() => {
          console.log('✅ Contact saved to device');
          Alert.alert('Success', 'Contact saved to device and app.');
        })
        .catch((err) => {
          console.error('Device Contact Error:', err);
          Alert.alert('Error', 'Failed to save contact to device.');
        });

      navigation.goBack();
    } catch (error) {
      console.log('Error saving contact:', error);
      Alert.alert('Error', 'Failed to save contact');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Contact Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={saveContact}>
        <Text style={styles.buttonText}>Save Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddContact;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f0f8ff' },
  input: { borderWidth: 1, borderColor: '#999', padding: 10, marginVertical: 10, borderRadius: 8 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

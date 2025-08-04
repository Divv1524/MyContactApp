import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addContact } from '../../redux/action';
import { useNavigation } from '@react-navigation/native';
import Contacts from 'react-native-contacts';

const AddContact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.contactList); // updated

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

  const validateMobile = (number) => /^[0-9]{10}$/.test(number);

  const saveContact = async () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }

    if (!validateMobile(mobile)) {
      Alert.alert('Invalid Mobile Number', 'Enter a valid 10-digit number.');
      return;
    }

    const granted = await requestPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Cannot save contact without permission');
      return;
    }

    const duplicate = contacts.find((c) => c.mobile === mobile);
    if (duplicate) {
      Alert.alert('Duplicate Contact', 'A contact with this mobile number already exists.');
      return;
    }

    const newContact = { name, mobile };

    // Save in Redux
    dispatch(addContact(newContact));
    console.log('Contact added in Redux:', newContact);

    // Save in device
    try {
      await Contacts.addContact({
        givenName: name,
        phoneNumbers: [{ label: 'mobile', number: mobile }],
      });

      console.log('✅ Saved to device');
      Alert.alert('Success', 'Contact saved to device and app.');
    } catch (err) {
      console.warn('Failed to save to device', err);
    }

    navigation.goBack();
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

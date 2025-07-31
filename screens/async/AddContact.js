import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddContact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();

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
      const existingContacts = JSON.parse(await AsyncStorage.getItem('CONTACTS')) || [];
      const duplicate = existingContacts.find(
        (contact) => contact.mobile === mobile
      );
      if (duplicate) {
        Alert.alert('Duplicate Contact','A contact with this mobile number already exists.');
        return;
      }
      const newContact = { name, mobile };
      const updatedContacts = [...existingContacts, newContact];
      await AsyncStorage.setItem('CONTACTS', JSON.stringify(updatedContacts));
      console.log('Contact saved:', newContact);
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

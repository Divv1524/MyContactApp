import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import { addContact, updateContact } from '../redux/slice/contactSlices';
import { SaveContactBtn } from "../components/AppButton";
import AppBackground from '../components/AppBackground';


const AddContact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const user = useSelector((state) => state.auth.user);
  const contacts = useSelector((state) => state.contacts.contacts);
  const editingContact = route.params?.contact || null;
//AddContact screen is used for both:new or edit 
//Are we editing a contact? → then pre-fill the form ,Otherwise → leave form blank
  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name);
      setMobile(editingContact.mobile);
    }
  }, [editingContact]);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const writeGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'App needs permission to save contacts to your device',
          buttonPositive: 'OK',
        }
      );

      const readGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Read Contacts Permission',
          message: 'App needs permission to read contacts from your device',
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

    const duplicate = contacts.find(
      (c) => c.mobile === mobile && c.id !== editingContact?.id
    );
    if (duplicate) {
      Alert.alert('Duplicate Contact', 'A contact with this mobile number already exists.');
      return;
    }

    const newContact = {
      id: editingContact ? editingContact.id : Date.now(),
      name,
      mobile,
    };

    if (editingContact) {
      dispatch(updateContact({ userId: user.id, contactId: editingContact.id, updatedData: newContact }));
    } else {
      dispatch(addContact({ userId: user.id, contact: newContact }));
    }

    try {
      const deviceContacts = await Contacts.getAll();

      if (editingContact) {
        //This finds a contact where:givenName matches the old contact's name, One of the phone numbers matches the old contact’s number
        const match = deviceContacts.find(
          (c) =>
            c.givenName === editingContact.name &&
            c.phoneNumbers.some((p) => p.number.replace(/\s/g, '') === editingContact.mobile)
        );
        if (match) {
          await Contacts.deleteContact(match);
        }
      }
      await Contacts.addContact({
        givenName: name,
        phoneNumbers: [{ label: 'mobile', number: mobile }],
      });

      Alert.alert('Success', editingContact ? 'Contact updated' : 'Contact saved');
      navigation.goBack();
    } catch (err) {
      console.warn('Failed to save to device', err);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <AppBackground>

      <View style={styles.screenContainer}>
        {/* Centered card for the form */}
        <View style={styles.centeredCard}>
          <TextInput
            style={styles.input}
            placeholder="Enter Contact Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
          <SaveContactBtn title={editingContact ? "Update Contact" : "Save Contact"}
          onPress={saveContact}/>
          
        </View>
      </View>
      </AppBackground>
    </>
  );
};

export default AddContact;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center', // centers vertically
    paddingHorizontal: 20,
  },
  centeredCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    color: 'black',
  },
});

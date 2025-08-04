import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteContact } from '../../redux/slice/contactSlices';

import Contacts from 'react-native-contacts';
import { logout } from '../../redux/slice/authSlices';

const Contact = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const contactList = useSelector((state) => state.contacts.contactList);

  const handleDelete = async (index) => {
    const contactToDelete = contactList[index];
    dispatch(deleteContact(index));

    try {
      const deviceContacts = await Contacts.getAll();
      const match = deviceContacts.find(
        (c) =>
          c.givenName === contactToDelete.name &&
          c.phoneNumbers.some((p) => p.number.replace(/\s/g, '') === contactToDelete.mobile)
      );
      if (match) {
        await Contacts.deleteContact(match);
        console.log('Contact deleted from device');
      }
    } catch (err) {
      console.warn('Error deleting contact from device:', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contactList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.list}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{String(item?.name || '').toUpperCase()}</Text>
              <Text style={{ marginLeft: 20 }}>{String(item?.mobile || '')}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.editbtn}
                onPress={() => navigation.navigate('AddContact', {
                  contact: item,
                  index,
                })}
              >
                <Text style={styles.text}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delbtn}
                onPress={() => handleDelete(index)}
              >
                <Text style={styles.text}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddContact')}>
        <Text style={styles.text}>Add New Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
        <Text style={styles.text}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  text: {
    color: '#fff',
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutbutton: {
    width: 100,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 20,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '90%',
    minHeight: 50,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  delbtn: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  editbtn: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loadContacts, deleteContact, clearContacts } from '../redux/slice/contactSlices';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlices';
import  { LogoutBtn, AddContactBtn, DelBtn, EditBtn } from "../components/AppButton";
import AppBackground from '../components/AppBackground';
import Contacts from 'react-native-contacts';

const Contact = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const contacts = useSelector((state) => state.contacts.contacts);

  useEffect(() => {
    if (user?.id) {
      dispatch(loadContacts(user.id));
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(clearContacts());
    dispatch(logout());
    navigation.navigate('Login');
  };

  const handleDelete = async(contact) => {
    try {
      // 1. Delete from your app (Redux + backend)
      dispatch(deleteContact({ userId: user.id, contactId: contact.id }));

      // 2. Delete from phone contacts
      const permission = await Contacts.requestPermission();

      if (permission === 'authorized') {
        // Find the contact in phone storage by name + number
        const phoneContacts = await Contacts.getAll();

        const match = phoneContacts.find(
          (c) =>
            c.displayName === contact.name &&
            c.phoneNumbers.some((p) => p.number.replace(/\D/g, '') === contact.mobile.replace(/\D/g, ''))
        );

        if (match) {
          await Contacts.deleteContact(match);
          Alert.alert('Deleted', 'Contact removed from phone also');
        } else {
          console.log('No matching phone contact found');
        }
      } else {
        Alert.alert('Permission denied', 'Cannot delete from phone contacts');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      Alert.alert('Error', 'Could not delete contact');
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
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>My Contacts</Text>
      </View>

      <View style={styles.container}>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.contactCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{String(item?.mobile || '')}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <EditBtn title='Edit'
                  onPress={() => navigation.navigate('AddContact', {
                    contact: item,
                    index: index,
                  })}
                />

                <DelBtn title='Delete'
                  style={styles.delbtn}
                  onPress={() => handleDelete(item)}
                />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No contacts available</Text>
          }
        />

        <View style={styles.bottomRow}>
          <LogoutBtn
            title="Logout"
            onPress={handleLogout}
          />
          <AddContactBtn
            title="Add New Contact"
            onPress={() => navigation.navigate("AddContact")}
          />
        </View>
      </View>
      </AppBackground>

    </>
    
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    padding: 10,
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
    color: '#222',
    textAlign: 'center',
  },
  contactPhone: {
    fontSize: 14,
    color: '#555',
    marginLeft: 20,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
});

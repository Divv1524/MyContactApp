import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loadContacts, deleteContact, clearContacts, } from '../redux/slice/contactSlices';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlices';

const Contact = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const contacts = useSelector((state) => state.contacts.contacts);

  // Load contacts when screen mounts for the logged-in user
  useEffect(() => {
    if (user?.id) {
      dispatch(loadContacts(user.id));
    }
  }, [dispatch, user]);

  // Handle logout
  const handleLogout = () => {
    dispatch(clearContacts());
    dispatch(logout());
    navigation.navigate('Login');
  };

  // Handle delete contact
  const handleDelete = (contactId) => {
    dispatch(deleteContact({ userId: user.id, contactId }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Contacts</Text>

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
              <TouchableOpacity
                style={styles.editbtn}
                onPress={() => navigation.navigate('AddContact', {
                  contact: item,
                  index: index,
                })}
              >
                <Text style={styles.text}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delbtn}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.text}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts available</Text>
        }
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.newsbtn} onPress={() => navigation.navigate('News')}>
          <Text style={styles.text}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locbtn} onPress={() => navigation.navigate('LocationScreen')}>
          <Text style={styles.text}>Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddContact')}
        >
          <Text style={styles.text}>Add New Contact</Text>
        </TouchableOpacity>
      </View>

      
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
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
    marginLeft: 20
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
  addBtn: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  logoutBtn: {
    flex: 1,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  delbtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10
  },
  editbtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginHorizontal: 10,
  },
  newsbtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  locbtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#8d6e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
});

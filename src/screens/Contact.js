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
      
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text style={styles.text}>Add New Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.newsbtn}onPress={() => navigation.navigate('News')}>
          <Text style={styles.text}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locbtn}onPress={() => navigation.navigate('LocationScreen')}>
          <Text style={styles.text}>Location</Text>
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
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 25
  },
  contactPhone: {
    fontSize: 14,
    color: 'black',
    marginLeft: 20
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
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
  logoutBtn: {
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
    padding: 8,
    borderRadius: 6,
    marginLeft: 10
  },
  editbtn: {
    backgroundColor: 'green',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent:'space-around' ,
    alignItems: 'center',
    marginBottom: 80,
  },
  newsbtn: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:10,
  },
  locbtn: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'brown',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

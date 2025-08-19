import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, Platform } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loadContacts, deleteContact, clearContacts } from '../redux/slice/contactSlices';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slice/authSlices';

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

  const handleDelete = (contactId) => {
    dispatch(deleteContact({ userId: user.id, contactId }));
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Full-screen decorative background */}
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
    </>
  );
};

export default Contact;

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
  headerContainer: {
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 10,
  },
  circle5: {
  position: 'absolute',
  width: 180,
  height: 180,
  borderRadius: 90,
  backgroundColor: 'rgba(255,255,255,0.1)',
  top: '45%',
  left: '10%',
},
circle6: {
  position: 'absolute',
  width: 140,
  height: 140,
  borderRadius: 70,
  backgroundColor: 'rgba(255,255,255,0.1)',
  top: '30%',
  right: '20%',
},
circle7: {
  position: 'absolute',
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255,255,255,0.1)',
  top: '60%',
  right: '10%',
},

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
    marginLeft: 10,
  },
  editbtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
});

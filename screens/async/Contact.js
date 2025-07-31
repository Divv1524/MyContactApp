import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';


const Contact = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [contactList, setContactList] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    const contactsS = await AsyncStorage.getItem('CONTACTS');
    const parsedContacts = contactsS ? JSON.parse(contactsS) : [];
    console.log("Saved contacts:", parsedContacts);
    setContactList(parsedContacts);
  };

  const deleteContact = async (index) => {
    const updatedContacts = contactList.filter((item, ind) => ind !== index);
    setContactList(updatedContacts);
    await AsyncStorage.setItem('CONTACTS', JSON.stringify(updatedContacts));
  };

  const handleLogout = async () => {
    await logout();
    // await AsyncStorage.setItem('LOGIN_STATUS', 'false');
    navigation.navigate('Login'); // go to login screen
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contactList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.list}>
            <View style={{ flexDirection: 'row' }}>
              <Text>{item.name.toUpperCase()}</Text>
              <Text style={{ marginLeft: 20 }}>{item.mobile}</Text>
            </View>
            <TouchableOpacity style={styles.delbtn} onPress={() => deleteContact(index)}>
              <Text style={styles.text}>Delete</Text>
            </TouchableOpacity>
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
    color: '#fff'
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
    alignItems: 'center'
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
    alignItems: 'center'
  },
  list: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    justifyContent: 'space-between'
  },
  delbtn: {
    backgroundColor: 'red',
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 20
  }
});

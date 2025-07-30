import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

let contacts=[];
const AddContact = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigation= useNavigation()
  const saveContacts= async()=>{
    let tempContact=[];
    contacts=[];
    let x = JSON.parse(await AsyncStorage.getItem('CONTACTS') || '[]');
    tempContact=x;
    tempContact.map(item=>{
        contacts.push(item);
    });                  
    contacts.push({name: name, mobile: mobile});
    await AsyncStorage.setItem('CONTACTS', JSON.stringify(contacts));
    console.log("✅ Contact saved:", { name, mobile });
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Contact Name"
        value={name}
        onChangeText={txt =>setName(txt)}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="number-pad"
        value={mobile}
        onChangeText={txt =>setMobile(txt)}
      />

      <TouchableOpacity style={styles.button} onPress={() =>{saveContacts()}}>
              <Text style={styles.title}>Save Contact</Text>
            </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#e9f5f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 50,
    width:'90%',
    borderColor: '#ccc',
    borderWidth: 2,
    alignSelf:'center',
    marginTop: 50,
    paddingLeft: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor:'#80c3d8',
    height:50,
    width:'90%',
    borderRadius: 20,
    alignSelf:'center',
    marginTop: 30,
    justifyContent:'center'

  },
});

export default AddContact;

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect  } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native';

const Contact = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [contactList, setcontactList] = useState([]);
    useEffect(() => {
        getData();
    }, [isFocused]);
    const getData = async () => {
        const contactsS = await AsyncStorage.getItem('CONTACTS');
        console.log("📄 Saved contacts:", JSON.parse(contactsS));
        setcontactList(JSON.parse(contactsS))

    };

    
    const deleteContact= async(index)=>{
        const tempData= contactList;
        const selectedData= tempData.filter((item, ind)=>{
            return ind!=index;
        });
        setcontactList(selectedData);
        await AsyncStorage.setItem('CONTACTS', JSON.stringify(selectedData));
    };
    const logout = async()=>{
        await AsyncStorage.setItem('EMAIL',"");
        await AsyncStorage.setItem('PASSWORD',"");
        navigation.navigate('Login')
    }
    return (
        <View style={{ flex: 1 }}>
            <FlatList data={contactList} renderItem={({ item, index }) => {
                return (
                    <View style={styles.list}>
                        <View style={{flexDirection:'row'}}>
                            <Text>{item.name.toUpperCase()}</Text>
                            <Text style={{marginLeft:20}}>{item.mobile}</Text>
                        </View>
                        <TouchableOpacity style={styles.delbtn} onPress={()=>{
                            deleteContact(index)
                        }}>
                            <Text style={styles.text}>Delete</Text>
                        </TouchableOpacity>
                    </View>

                )
            }} />
            <TouchableOpacity style={styles.button} onPress={() => {
                navigation.navigate('AddContact')
            }}>
                <Text style={styles.text}>Add New Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutbutton} onPress={() => {
                logout()
            }}>
                <Text style={styles.text}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
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
        alignSelf:'center',
        borderRadius:10,
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:20,
        justifyContent:'space-between'
    },
    delbtn:{
        backgroundColor:'red', 
        paddingLeft:10,
        paddingRight:10,  
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        marginRight:20

    }
});
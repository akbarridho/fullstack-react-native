import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect, useRouter } from "expo-router";
import { be_url } from "@/config";

export default function AccountScreen() {
    const router = useRouter()

    const [formUser, setFormUser] = useState({
        'id': 0,
        'name': '',
        'email': '',
        'role_id': null,
        'password': ''
    })

    const handleChange = (field: any, value: any) => {
        setFormUser((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }

    const [dataRole, setDataRole] = useState([])

    const handleLogOut = async () => {
        try {
            await AsyncStorage.clear()
            router.push('/login')
        } catch (error) {
            console.error(error)
        }
    }

    const handleUser = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/users/${formUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': token
                },
                body: JSON.stringify(formUser)
            })
            const data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                Alert.alert(data.message)
            }
        } catch (error: any) {
            Alert.alert(`${error.message}`)
        }
    }

    const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    const dataUser = async () => {
        const token: any = await AsyncStorage.getItem('access_token')
        try {
            let response = await fetch(`${be_url}/users`, {
                method: 'GET',
                headers: {
                    'access_token': token
                }
            })
            const data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            }
            setFormUser({
                id: data.id,
                email: data.email,
                name: data.name,
                role_id: data.role_id,
                password: ''
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    const dataDropdownRole = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/roles`, {
                method: 'GET',
                headers: {
                    access_token: token
                }
            })
            const data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                const dropdownData = data.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }));
                setDataRole(dropdownData);
            }
        } catch (error: any) {
            console.error({ message: error.message })
        }

    }

    useFocusEffect(
        useCallback(() => {
            dataUser()
            dataDropdownRole()
            return () => {
                backHandler.remove()
            }
        },[])
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={formUser.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={formUser.email}
                onChangeText={(value) => handleChange('email', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={formUser.password}
                onChangeText={(value) => handleChange('password', value)}
            />
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dataRole}
                search
                maxHeight={300}
                disable={true}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                searchPlaceholder="Search..."
                value={formUser.role_id}
                onChange={(item: any) => {
                    handleChange('role_id', item.value);
                }}
            />
            <TouchableOpacity style={styles.buttonEdit} onPress={handleUser}>
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLogOut} onPress={handleLogOut}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    buttonLogOut: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    buttonEdit: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 20
    },
    placeholderStyle: {
        fontSize: 16,
        color: 'gray',
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    }
});
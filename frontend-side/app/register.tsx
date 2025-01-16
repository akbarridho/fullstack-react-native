import { be_url } from "@/config";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";

export default function RegisterScreen() {
    const router = useRouter()
    const [formUser, setFormUser] = useState({
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

    const handleRegitser = async () => {
        try {
            const response = await fetch(`${be_url}/auth/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formUser)
            })
            const data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            }
            Alert.alert('Success', data.message, [
                { text: 'Oke', onPress: () => router.push('/login') }
            ]);
            router.push('/login')
        } catch (error: any) {
            handleError(error.message)
        }
    }

    const handleError = (message: any) => {
        Alert.alert(message);
    }

    const [dataRole, setDataRole] = useState([])

    useEffect(() => {
        const dataDropdownRole = async () => {
            try {
                let response = await fetch(`${be_url}/roles`, {
                    method: 'GET'
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

        dataDropdownRole()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                searchPlaceholder="Search..."
                value={formUser.role_id}
                onChange={(item: any) => {
                    handleChange('role_id', item.value);
                }}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegitser}>
                <Text style={styles.buttonText}>Save</Text>
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
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
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
import { be_url } from "@/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter, useSearchParams } from "expo-router/build/hooks"
import { useEffect, useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"

export default function EditTaskScreen() {
    const searchParam = useSearchParams()
    const taskId = searchParam.get('taskId')

    const [formTask, setFormTask] = useState({
        'name': '',
        'description': '',
        'priority_id': '',
        'project_id': 0
    })

    const [dataPriority, setDataPriority] = useState([])

    const router = useRouter()


    const handleChange = (field: any, value: any) => {
        setFormTask((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }

    const handleTask = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            const response = await fetch(`${be_url}/tasks/byId/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': token
                },
                body: JSON.stringify(formTask)
            })
            let data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                Alert.alert(data.message)
                router.push(`/(tabs)/project/${formTask.project_id}/list-task`)
            }
        } catch (error: any) {
            Alert.alert(error.message)
        }
    }

    useEffect(() => {
        const fetchDataDetailTask = async () => {
            try {
                const token: any = await AsyncStorage.getItem('access_token')
                let response = await fetch(`${be_url}/tasks/byId/${taskId}`, {
                    method: 'GET',
                    headers: {
                        'access_token': token
                    }
                })
                let data = await response.json()
                if (!response.ok) {
                    throw {message: data.message}
                } else {
                    setFormTask({
                        name: data.name,
                        description: data.description,
                        priority_id: data.priority_id,
                        project_id: data.project_id
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }

        const dataDropdownTask = async () => {
            try {
                const token: any = await AsyncStorage.getItem('access_token')
                let response = await fetch(`${be_url}/priorities`, {
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
                    setDataPriority(dropdownData);
                }
            } catch (error: any) {
                console.error({ message: error.message })
            }

        }

        fetchDataDetailTask()
        dataDropdownTask()
    }, [])


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Task</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={formTask.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={formTask.description}
                onChangeText={(value) => handleChange('description', value)}
            />
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dataPriority}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Priority"
                searchPlaceholder="Search..."
                value={formTask.priority_id}
                onChange={(item: any) => {
                    handleChange('priority_id', item.value);
                }}
            />
            <TouchableOpacity style={styles.button} onPress={handleTask}>
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
    registerText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    registerLink: {
        color: '#6200EE',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
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
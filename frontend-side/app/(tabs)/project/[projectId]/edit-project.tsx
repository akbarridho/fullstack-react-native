import { be_url } from "@/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { useSearchParams } from "expo-router/build/hooks"
import { useEffect, useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function EditProjectScreen() {
    const searchParam = useSearchParams()
    const projectId = searchParam.get('projectId')
    const [formProject, setFormProject] = useState({
        'name': ''
    })

    const router = useRouter()

    const handleChange = (field: any, value: any) => {
        setFormProject((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }

    const handleProject = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            const response = await fetch(`${be_url}/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': token
                },
                body: JSON.stringify({
                    name: formProject.name
                })
            })
            let data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                Alert.alert(data.message)
                router.push(`/(tabs)/project/list-project`)
            }
        } catch (error: any) {
            Alert.alert(error.message)
        }
    }

    useEffect(() => {
        const fetchDetailProject = async () => {
            try {
                const token: any = await AsyncStorage.getItem('access_token')
                let response = await fetch(`${be_url}/projects/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'access_token': token
                    }
                })
                let data = await response.json()
                if (!response.ok) {
                    throw { message: data.message }
                } else {
                    setFormProject(data)
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchDetailProject()
    },[])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Project</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={formProject.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TouchableOpacity style={styles.button} onPress={handleProject}>
                <Text style={styles.buttonText}>Update</Text>
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
});
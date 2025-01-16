import { be_url } from "@/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter, useSearchParams } from "expo-router/build/hooks"
import { useEffect, useState } from "react"
import { Alert, Button, StyleSheet, Text, View } from "react-native"

export default function DetailTaskScreen() {
    const searchParam = useSearchParams()
    const taskId = searchParam.get('taskId')

    const router = useRouter()

    const [dataDetailTask, setDataDetailTask] = useState({
        'id': 0,
        'name': '',
        'description': '',
        'project_id': 0,
        'priority_id': 0,
        'is_done': false,
        'priority': '',
        'status': ''
    })

    const updateTaskIntoDone = async () => {
        const token: any = await AsyncStorage.getItem('access_token')
        Alert.alert('Hold on!', `Are you sure want to finish "${dataDetailTask.name}"?`, [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: 'YES',
                onPress: async () => {
                    let response = await fetch(`${be_url}/tasks/byId/${taskId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'access_token': token
                        }
                    })
                    const data = await response.json()
                    if (!response.ok) {
                        throw { message: data.message }
                    } else {
                        router.push(`/(tabs)/project/${dataDetailTask.project_id}/list-task`)
                    }
                }
            }
        ])
    }

    const deleteTask = async () => {
        const token: any = await AsyncStorage.getItem('access_token')
        Alert.alert('Hold on!', 'Are you sure want to delete the data?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: 'YES',
                onPress: async () => {
                    let response = await fetch(`${be_url}/tasks/byId/${taskId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'access_token': token
                        }
                    })
                    const data = await response.json()
                    if (!response.ok) {
                        throw { message: data.message }
                    } else {
                        router.push(`/(tabs)/project/${dataDetailTask.project_id}/list-task`)
                    }
                }
            }
        ])
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
                    throw { message: data.message }
                } else {
                    if (data.is_done) {
                        data.status = 'Done'
                    } else {
                        data.status = 'Not Done'
                    }
                    setDataDetailTask({
                        id: data.id,
                        name: data.name,
                        description: data.description,
                        project_id: data.project_id,
                        priority_id: data.priority_id,
                        is_done: data.is_done,
                        priority: data.priority.name,
                        status: data.status
                    })
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchDataDetailTask()
    }, [])

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Task
                </Text>
            </View>
            <View>
                <Text style={styles.item}>
                    Title: {dataDetailTask.name}
                </Text>
            </View>
            <View>
                <Text style={styles.item}>
                    Description: {dataDetailTask.description}
                </Text>
            </View>
            <View>
                <Text style={styles.item}>
                    Priority: {dataDetailTask.priority}
                </Text>
            </View>
            <View>
                <Text style={styles.item}>
                    Status: {dataDetailTask.status}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                {!dataDetailTask.is_done && (
                    <View style={styles.button}>
                        <Button title="Edit" color="blue" onPress={() => router.push(`/(tabs)/project/${dataDetailTask.project_id}/${taskId}/edit-task`)} />
                    </View>
                )
                }
                <View style={styles.button}>
                    <Button title="Delete" color="red" onPress={deleteTask} />
                </View>
                {!dataDetailTask.is_done && (
                    <View style={styles.button}>
                        <Button title="Done" color="green" onPress={updateTaskIntoDone} />
                    </View>
                )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        margin: 10
    },
    item: {
        color: 'white',
        padding: 10
    },
    button: {
        flex: 1,
        margin: 10
    }
})
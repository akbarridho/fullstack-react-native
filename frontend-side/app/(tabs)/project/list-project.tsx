import { be_url } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, View } from "react-native";
import { DataTable, Text } from "react-native-paper";

export default function ProjectScreen() {
    const router = useRouter()
    const [dataProject, setDataProject] = useState([])

    const navigateToDetails = (projectId: number) => {
        router.push(`/(tabs)/project/${projectId}/list-task`); // Navigate with dynamic ID in the URL
    };

    const fetchDataProject = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/projects`, {
                method: 'GET',
                headers: {
                    "access_token": token
                }
            })
            let result = await response.json()
            if (!response.ok) {
                throw { message: result.message }
            } else {
                setDataProject(result)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchDataUser = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/users`, {
                method: 'GET',
                headers: {
                    'access_token': token
                }
            })
            let data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                if (data.role.name != 'Penjual') {
                    Alert.alert(`Hold on!`, `You don't have permission`)
                    router.push(`/(tabs)`)
                } else {
                    fetchDataProject()
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchDataUser()
        }, [])
    )

    return (
        <ScrollView>
            <DataTable style={styles.container}>
                <View>
                    <Text style={styles.textTitle}>
                        Projects
                    </Text>
                </View>
                <View style={styles.buttonAdd}>
                    <Button title="Add" color="green" onPress={() => router.push('/(tabs)/project/create-project')} />
                </View>
                <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title style={styles.widhtColumnNumber}>No.</DataTable.Title>
                    <DataTable.Title style={styles.widhtColumnTitle}>Title</DataTable.Title>
                </DataTable.Header>
                {dataProject.map((item: any, index: number) => (
                    <DataTable.Row key={`project_id_${item.id}`}>
                        <DataTable.Cell style={styles.widhtColumnNumber}>
                            <Text style={styles.textValue}>
                                {index + 1}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.widhtColumnTitle}>
                            <Text style={styles.textValue}>
                                {item.name}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                            <Text style={styles.widhtColumnButton}>
                                <Button title="View Data" onPress={() => navigateToDetails(item.id)} />
                            </Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 30
    },
    tableHeader: {
        backgroundColor: '#DCDCDC',
    },
    textValue: {
        color: 'white'
    },
    textTitle: {
        fontSize: 40,
        color: 'white'
    },
    widhtColumnNumber: {
        flex: 0.5
    },
    widhtColumnTitle: {
        flex: 1.5
    },
    widhtColumnButton: {
        flex: 1
    },
    buttonAdd: {
        width: '20%',
        margin: 10
    }
});
import { be_url } from "@/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { useRouter, useSearchParams } from "expo-router/build/hooks"
import { useCallback, useState } from "react"
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function EditAuctionScreen() {
    const searchParam = useSearchParams()
    const auctionId = searchParam.get('auctionId')

    const router = useRouter()

    const [formAuction, setformAuction] = useState({
        name: '',
        price: '',
        img: ''
    })

    const handleChange = (field: any, value: any) => {
        setformAuction((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }

    const fetchDataAuction = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/auctions/${auctionId}`, {
                method: 'GET',
                headers: {
                    'access_token': token
                }
            })
            let data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                setformAuction({
                    name: data.name,
                    price: data.price?.toString(),
                    img: data.img
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleAuction = async () => {
        try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/auctions/${auctionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'access_token': token
                },
                body: JSON.stringify(formAuction)
            })
            let data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            } else {
                Alert.alert(data.message)
                router.push(`/auction/${auctionId}/detail-auction`)
            }
        } catch (error) {

        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchDataAuction()
        },[])
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Auction</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={formAuction.name}
                onChangeText={(value) => handleChange('name', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={formAuction.price}
                keyboardType="numeric"
                onChangeText={(value) => handleChange('price', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Image Link"
                value={formAuction.img}
                onChangeText={(value) => handleChange('img', value)}
            />
            <TouchableOpacity style={styles.button} onPress={handleAuction}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.push(`/auction/${auctionId}/detail-auction`)}>
                <Text style={styles.buttonText}>Back</Text>
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
        margin: 10
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
    }
});
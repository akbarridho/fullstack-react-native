import { be_url } from "@/config"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { useRouter, useSearchParams } from "expo-router/build/hooks"
import { useCallback, useState } from "react"
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native"

export default function AuctionDetailScreen() {
    const searchParam = useSearchParams()
    const auctionId = searchParam.get('auctionId')

    const router = useRouter()

    const [dataDetailAuction, setDataDetailAuction] = useState({
        'name': '',
        'price': 0,
        'img': '',
        'is_sold': false
    })

    const formatToIDR = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const deleteAuction = async () => {
        const token: any = await AsyncStorage.getItem('access_token')
        Alert.alert('Hold on!', `Are you sure want to delete ${dataDetailAuction.name}?`, [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel'
            },
            {
                text: 'YES',
                onPress: async () => {
                    let response = await fetch(`${be_url}/auctions/${auctionId}`, {
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
                        router.push(`/(tabs)`)
                    }
                }
            }
        ])
    }

    const fetchDataDetailAuction = async () => {
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
                setDataDetailAuction({
                    name: data.name,
                    price: data.price,
                    img: data.img,
                    is_sold: data.is_sold
                })
            }
        } catch (error) {
            console.error(error)
        }
    }


    useFocusEffect(
        useCallback(() => {
            fetchDataDetailAuction()
        }, [])
    )

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.item}>
                    Name: {dataDetailAuction.name}
                </Text>
            </View>
            <View>
                <Text style={styles.item}>
                    Price: {formatToIDR(dataDetailAuction.price)}
                </Text>
            </View>
            <View style={{ alignItems: 'center', margin: 10 }}>
                {dataDetailAuction.img ? (
                    <Image
                        source={{ uri: dataDetailAuction.img }}
                        style={{ width: 300, height: 300 }}
                    />
                ) : (
                    <Text>No valid image available</Text>
                )}
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.button}>
                    <Button title="Delete" color="red" onPress={deleteAuction} />
                </View>
                {!dataDetailAuction.is_sold &&
                    <View style={styles.button}>
                        <Button title="Edit" color="blue" onPress={() => router.push(`/auction/${auctionId}/edit-auction`)} />
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
import { StyleSheet, Alert, BackHandler, View, Text, Button } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Card } from 'react-native-paper';
import { be_url } from '@/config';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  const router = useRouter()

  const [dataAuctions, setDataAuctions] = useState([])
  const [penjual, setIsPenjual] = useState(false)

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

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      router.replace('/login'); // Redirect to login if not authenticated
    } else {
      fetchAuction()
      fetchUser()
      return () => {
        backHandler.remove()
      }
    }
  };

  const fetchAuction = async () => {
    try {
      const token: any = await AsyncStorage.getItem('access_token')
      let response = await fetch(`${be_url}/auctions`, {
        method: 'GET',
        headers: {
          'access_token': token
        }
      })
      let data = await response.json()
      if (!response.ok) {
        throw { message: data.message }
      } else {
        setDataAuctions(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUser = async () => {
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
        if (data.role.name == 'Penjual') {
          setIsPenjual(true)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const formatToIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const handleTransaction = async (auctionId: number) => {
    Alert.alert(`Confirmation`, `Are you sure want to purchase this item?`, [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel'
      },
      {
        text: 'YES',
        onPress: async () => {
          try {
            const token: any = await AsyncStorage.getItem('access_token')
            let response = await fetch(`${be_url}/transactions/${auctionId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'access_token': token
              }
            })
            let data = await response.json()
            if (!response.ok) {
              throw { message: data.message }
            } else {
              Alert.alert(data.message)
              router.push(`/transaction/list-transaction`)
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    ])
  }

  useFocusEffect(
    useCallback(() => {
      checkAuth()
    }, [])
  )

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>
          Auctions
        </Text>
        {penjual ? (
          <View style={{ width: '25%', margin: 10 }}>
            <Button title='ADD' onPress={() => router.push(`/auction/create-auction`)} />
          </View>
        ) : (
          <View style={{ width: '40%', margin: 10 }}>
            <Button title='TRANSACTION' color='green' onPress={() => router.push(`/transaction/list-transaction`)} />
          </View>
        )
        }
        <View style={styles.row}>
          {dataAuctions.map((el: any) => (
            <Card style={styles.card} key={`auction_${el.id}`}>
              <Card.Cover source={{ uri: el.img }} />
              <Card.Content>
                <Text>{el.name}</Text>
                <Text>{formatToIDR(el.price)}</Text>
              </Card.Content>
              <Card.Actions>
                {!penjual ? (
                  !el.is_sold ? (
                    <Button title='Buy' color="blue" onPress={() => handleTransaction(el.id)} />
                  ) : (
                    <Text>Sold Out</Text>
                  )
                ) : (
                  <Button title='Detail' color="green" onPress={() => router.push(`/auction/${el.id}/detail-auction`)} />
                )
                }
              </Card.Actions>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingTop: 30
  },
  title: {
    fontSize: 30,
    color: 'white'
  },
  card: {
    width: '48%',
    marginBottom: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
});

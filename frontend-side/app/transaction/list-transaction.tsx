import { be_url } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";

export default function ListTransaction() {
  
    const [dataTransaction, setDataTransaction] = useState([])
  
    const fetchTransaction = async () => {
      try {
        const token: any = await AsyncStorage.getItem('access_token')
        let response = await fetch(`${be_url}/transactions`, {
          method: 'GET',
          headers: {
            'access_token': token
          }
        })
        let data = await response.json()
        if (!response.ok) {
          throw { message: data.message }
        } else {
          setDataTransaction(data)
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
  
    useFocusEffect(
      useCallback(() => {
        fetchTransaction()
      }, [])
    )
  
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>
            Transactions
          </Text>
          <View style={styles.row}>
            {dataTransaction.map((el: any) => (
              <Card style={styles.card} key={`transaction_${el.id}`}>
                <Card.Cover source={{ uri: el.auction.img }} />
                <Card.Content>
                  <Text>{el.auction.name}</Text>
                  <Text>{formatToIDR(el.auction.price)}</Text>
                </Card.Content>
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
      paddingTop: 10
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
      flexWrap: 'wrap',
      paddingTop: 10
    }
  });
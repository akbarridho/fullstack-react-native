import { Alert, Button, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { DataTable, RadioButton } from 'react-native-paper';
import { Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { be_url } from '@/config';
import { useSearchParams } from 'expo-router/build/hooks';
import { useFocusEffect, useRouter } from 'expo-router'

export default function TaskScreen() {
  const [data, setData] = useState([])
  const [detailData, setDetailData] = useState({
    'name': ''
  })
  const [dataPriorities, setDataPriorites] = useState([])
  const [valuePriority, setValuePriority] = useState('all');

  const searchParam = useSearchParams()
  const projectId = searchParam.get('projectId')

  const router = useRouter()

  const deleteProject = async () => {
    const token: any = await AsyncStorage.getItem('access_token')
    Alert.alert('Hold on!', `Are you sure want to delete "${detailData.name}" project?`, [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel'
      },
      {
        text: 'YES',
        onPress: async () => {
          let response = await fetch(`${be_url}/projects/${projectId}`, {
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
            router.push('/(tabs)/project/list-project')
          }
        }

      }
    ])
  }

  const fetchDataTask = async () => {
    try {
      if (valuePriority == 'all') {
        const token: any = await AsyncStorage.getItem('access_token')
        const response = await fetch(`${be_url}/tasks/${projectId}`, {
          method: 'GET',
          headers: {
            'access_token': token,
          }
        })
        const result = await response.json()
        if (!response.ok) {
          throw { message: result.message }
        }
        result.forEach((element: any) => {
          if (element.is_done) {
            element.status = 'Done'
          } else {
            element.status = 'Not Done'
          }
        });
        setData(result)
      } else {
        const token: any = await AsyncStorage.getItem('access_token')
        const response = await fetch(`${be_url}/tasks/${projectId}?priority_id=${valuePriority}`, {
          method: 'GET',
          headers: {
            'access_token': token,
          }
        })
        const result = await response.json()
        if (!response.ok) {
          throw { message: result.message }
        }
        result.forEach((element: any) => {
          if (element.is_done) {
            element.status = 'Done'
          } else {
            element.status = 'Not Done'
          }
        });
        setData(result)
      }
    } catch (error: any) {
      console.error('Error', error.message)
    }
  }

  const fetchDetailDataProject = async () => {
    try {
      const token: any = await AsyncStorage.getItem('access_token')
      const response = await fetch(`${be_url}/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'access_token': token,
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()
      setDetailData(result)
    } catch (error: any) {
      console.error('Error', error.message)
    }
  }

  const fetchPriority = async () => {
    try {
      const token: any = await AsyncStorage.getItem('access_token')
      let response = await fetch(`${be_url}/priorities`, {
        method: 'GET',
        headers: {
          'access_token': token
        }
      })
      let data = await response.json()
      if (!response.ok) {
        throw { message: data.message }
      } else {
        setDataPriorites(data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchDetailDataProject()
      fetchDataTask();
      fetchPriority()
    }, [valuePriority])
  )

  return (
    <ScrollView>
      <DataTable style={styles.container}>
        <Text style={styles.textTitle}>
          {detailData.name}
        </Text>
        <View style={styles.rowButton}>
          <View style={styles.buttonAdd}>
            <Button title='Add' color='green' onPress={() => router.push(`/(tabs)/project/${projectId}/create-task`)} />
          </View>
          <View style={styles.buttonAdd}>
            <Button title='Edit' color='blue' onPress={() => router.push(`/(tabs)/project/${projectId}/edit-project`)} />
          </View>
          <View style={styles.buttonAdd}>
            <Button title='Delete' color='red' onPress={deleteProject} />
          </View>
        </View>
        <View style={styles.containerRadio}>
          <View style={styles.buttonRadio}>
            <RadioButton
              value="first"
              status={valuePriority === 'all' ? 'checked' : 'unchecked'}
              onPress={() => setValuePriority('all')}
            />
            <Text style={styles.textRadio}>All</Text>
          </View>
          {dataPriorities.map((el: any) => (
            <View style={styles.buttonRadio} key={`priority_radio_button_${el.id}`}>
              <RadioButton
                value={el.id}
                status={valuePriority === el.id ? 'checked' : 'unchecked'}
                onPress={() => setValuePriority(el.id)}
              />
              <Text style={styles.textRadio}>{el.name}</Text>
            </View>
          ))}
        </View>
        <DataTable.Header style={styles.tableHeader}>
          <DataTable.Title style={styles.widhtColumnNumber}>No.</DataTable.Title>
          <DataTable.Title style={styles.widhtColumnTitle}>Title</DataTable.Title>
          <DataTable.Title style={styles.widthColumnPriority}>Priority</DataTable.Title>
          <DataTable.Title style={styles.widthColumnStatus}>Status</DataTable.Title>
          <DataTable.Title style={styles.widthColumnButton}> </DataTable.Title>
        </DataTable.Header>
        {data.map((item: any, index: number) => (
          <DataTable.Row key={`task_id_${item.id}`}>
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
            <DataTable.Cell style={styles.widthColumnPriority}>
              <Text style={styles.textValue}>
                {item.priority.name}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.widthColumnStatus}>
              <Text style={styles.textValue}>
                {item.status}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell style={styles.widthColumnButton}>
              <TouchableOpacity style={styles.styleButtonInColumn} onPress={() => router.push(`/(tabs)/project/${projectId}/${item.id}/detail-task`)}>
                <Text style={styles.styleButtonTextInColumn}>
                  Detail
                </Text>
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
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
    color: 'white',
    fontSize: 12
  },
  textTitle: {
    fontSize: 40,
    color: 'white'
  },
  widhtColumnNumber: {
    flex: 0.5
  },
  widhtColumnTitle: {
    flex: 2
  },
  widthColumnPriority: {
    flex: 1
  },
  widthColumnStatus: {
    flex: 1
  },
  widthColumnButton: {
    flex: 1
  },
  styleButtonInColumn: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  styleButtonTextInColumn: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  buttonAdd: {
    flex: 1,
    margin: 10
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  containerRadio: {
    flexDirection: 'row',
    marginBottom: 10
  },
  buttonRadio: {
    marginRight: 10
  },
  textRadio: {
    color: 'white',
    textAlign: 'center'
  }
});

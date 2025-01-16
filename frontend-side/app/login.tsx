import { View, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { be_url } from "@/config";

export default function LoginScreen() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        try {
            const response = await fetch(`${be_url}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await response.json()
            if (!response.ok) {
                throw { message: data.message }
            }
            await AsyncStorage.setItem('access_token', data.access_token)
            router.push('/(tabs)')
        } catch (error: any) {
            Alert.alert(error.message)
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                router.replace('/(tabs)');
            }
        };

        checkAuth()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.registerText}>
                Doesn't have an account?{' '}
                <Link href="/register" style={styles.registerLink}>
                    Please Register
                </Link>
            </Text>
        </View>
    );
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
import { Stack } from 'expo-router';
import React from 'react';

export default function TransactionLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="list-transaction"
                options={{
                    title: 'List Transaction',
                }}
            />
        </Stack>
    );
}
import { Stack } from 'expo-router';
import React from 'react';

export default function AuctionLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="detail-auction"
                options={{
                    title: 'Detail Auction',
                }}
            />
            <Stack.Screen
                name="edit-auction"
                options={{
                    title: 'Edit Auction',
                }}
            />
        </Stack>
    );
}
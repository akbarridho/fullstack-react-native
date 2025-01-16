import { Stack } from 'expo-router';
import React from 'react';

export default function AuctionLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="[auctionId]"
                options={{
                    headerShown: false,
                    title: 'Detail Auction',
                }}
            />
            <Stack.Screen
                name="create-auction"
                options={{
                    headerShown: false,
                    title: 'Create Auction',
                }}
            />
        </Stack>
        
    );
}
import { Stack } from 'expo-router';
import React from 'react';

export default function ProjectLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="list-project"
                options={{
                    headerShown: false,
                    title: 'List Project'
                }}
            />
            <Stack.Screen
                name="create-project"
                options={{
                    title: 'Create Project',
                    headerTitle: ''
                }}
            />
            <Stack.Screen
                name="[projectId]"
                options={{
                    headerShown: false,
                    title: 'Project Detail'
                }}
            />
        </Stack>
    );
}
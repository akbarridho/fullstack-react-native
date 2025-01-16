import { Stack } from 'expo-router';

export default function TaskIdLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="detail-task"
        options={{
          title: 'Data Task',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="edit-task"
        options={{
          title: 'Edit Task',
          headerShown: false
        }}
      />
    </Stack>
  );
}

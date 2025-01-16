import { Stack } from 'expo-router';

export default function ProjectIdLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="list-task"
        options={{
          title: 'Task',
          headerTitle: ''
        }}
      />
      <Stack.Screen
        name="create-task"
        options={{
          title: 'Create Task',
          headerTitle: ''
        }}
      />
      <Stack.Screen
        name="edit-project"
        options={{
          title: 'Edit Task',
          headerTitle: ''
        }}
      />
      <Stack.Screen
        name="[taskId]"
        options={{
          title: 'Detail Task',
          headerTitle: ''
        }}
      />
    </Stack>
  );
}

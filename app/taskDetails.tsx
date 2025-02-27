import { View, Text, Button } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteTask } from '../redux/tasksSlice';

// Define Task Type
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export default function TaskDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((task: Task) => task.id === params.id)
  );

  useEffect(() => {
    navigation.setOptions({ title: 'Task Details' });
  }, [navigation]);

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ marginTop: 10 }}>Title: {task.title}</Text>
      <Text style={{ marginTop: 10 }}>Description: {task.description}</Text>
      <Text style={{ marginTop: 10 }}>Due Date: {task.dueDate}</Text>

      <View style={{ marginTop: 15 }}>
        <Button title="Edit" onPress={() => router.push(`/addTask?id=${task.id}`)} />
      </View>

      <View style={{ marginTop: 15 }}>
        <Button
          title="Delete"
          onPress={() => {
            dispatch(deleteTask(task.id));
            router.push('/');
          }}
          color="red"
        />
      </View>
    </View>
  );
}

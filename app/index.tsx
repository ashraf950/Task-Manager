import { View, FlatList, Text, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteTask } from '../redux/tasksSlice';
import { saveTasks } from '../utils/storage';

// Define Task Type
interface Task {
  id: string;
  title: string;
  dueDate: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks) as Task[];
  
  const [search, setSearch] = useState<string>('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setFilteredTasks(tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase())));
    saveTasks(tasks);
  }, [tasks, search]);

  // Set header title
  useEffect(() => {
    navigation.setOptions({ title: "Home" });
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput 
        placeholder="Search tasks..." 
        value={search} 
        onChangeText={setSearch} 
        style={{ borderWidth: 1, borderColor: "grey", borderRadius: 5, backgroundColor: "#fff", marginBottom: 15 }} 
      />
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/taskDetails?id=${item.id}`)} style={{ paddingVertical: 10 }}>
            <Text>{item.title} - {item.dueDate}</Text>
            <TouchableOpacity onPress={() => dispatch(deleteTask(item.id))} style={{ marginTop: 10 }}>
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => router.push('/addTask')}>
        <Text style={{ fontSize: 20 }}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

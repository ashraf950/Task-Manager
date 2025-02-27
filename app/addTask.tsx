import { View, Text, TextInput, Button } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask } from '../redux/tasksSlice';
import { RootState } from '../redux/store';
import uuid from 'react-native-uuid';
import DateTimePicker from 'expo-datepicker';

// Define Task Type
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

export default function AddTaskScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();

  const existingTask = useSelector((state: RootState) =>
    state.tasks.tasks.find((task: Task) => task.id === params.id)
  );

  const [title, setTitle] = useState<string>(existingTask?.title || '');
  const [description, setDescription] = useState<string>(existingTask?.description || '');
  const [dueDate, setDueDate] = useState<Date>(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : new Date()
  );

  const [errors, setErrors] = useState<{ title: string; description: string; dueDate: string }>({
    title: '',
    description: '',
    dueDate: '',
  });

  const validateFields = (): boolean => {
    let valid = true;
    let newErrors = { title: '', description: '', dueDate: '' };

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }
    if (!dueDate) {
      newErrors.dueDate = 'Due Date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = () => {
    if (!validateFields()) return;

    const formattedDate =
      dueDate instanceof Date && !isNaN(dueDate.getTime())
        ? dueDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD
        : '';

    const task: Task = {
      id: existingTask?.id || uuid.v4().toString(),
      title,
      description,
      dueDate: formattedDate,
    };

    if (existingTask) dispatch(updateTask(task));
    else dispatch(addTask(task));

    router.push('/');
  };

  useEffect(() => {
    navigation.setOptions({ title: 'Add Task' });
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' }}
      />
      {errors.title ? <Text style={{ color: 'red' }}>{errors.title}</Text> : null}

      <Text>Description:</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' }}
      />
      {errors.description ? <Text style={{ color: 'red' }}>{errors.description}</Text> : null}

      <Text>Due Date:</Text>
      <DateTimePicker
        value={dueDate}
        mode="date"
        display="default"
        onChange={(event: any, selectedDate?: Date) => {
          if (selectedDate) {
            setDueDate(selectedDate);
          }
        }}
      />
      {errors.dueDate ? <Text style={{ color: 'red' }}>{errors.dueDate}</Text> : null}

      <View style={{ marginTop: 15 }}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
}

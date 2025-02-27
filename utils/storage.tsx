import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';

export const saveTasks = async (tasks: any) => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadTasks = async () => {
  const tasks = await AsyncStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { setTasks } from './tasksSlice';
import { loadTasks } from '../utils/storage';

export const store = configureStore({
  reducer: { tasks: tasksReducer },
});

// Load tasks from AsyncStorage and update Redux store
loadTasks().then((tasks) => {
  store.dispatch(setTasks(tasks));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

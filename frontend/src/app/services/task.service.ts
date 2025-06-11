import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

const TASKS_STORAGE_KEY = 'taskmaster-tasks'; // 🔑 unique key for localStorage

@Injectable({ providedIn: 'root' })
export class TaskService {
  
  private tasks = new BehaviorSubject<Task[]>(this.loadTasksFromStorage()); // all tasks saved here (localStorage)
  // private tasks = new BehaviorSubject<Task[]>([]); // all tasks saved here (main tasks list)
  tasksObservable$ = this.tasks.asObservable(); // for read-only and subscriptions

  constructor() {
    // 🧠 Subscribe to every task change and persist to localStorage
    this.tasks.subscribe(updatedTasks => {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
    });
  }
 
  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(), title, completed: false
    };
    this.tasks.next([...this.tasks.value, newTask]);
  }

  toggleTask(id: number) {
    const updated = this.tasks.value.map(task => 
      task.id === id
      ?
      {...task, completed: !task.completed } : task
    );
    this.tasks.next(updated)
  }

  removeTask(id: number) {
    const updated = this.tasks.value.filter(task => task.id !== id);
    this.tasks.next(updated);
  }

  // 🧠 Load from localStorage (if any)
  private loadTasksFromStorage(): Task[] {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY); // Get the data with unique key TASKS_STORAGE_KEY
    console.log('LocalStorage Data: ', raw);
    return raw ? JSON.parse(raw) : []; // return the data that coming form localStorage in JSON format
  }

}

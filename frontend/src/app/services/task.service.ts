// 🔁 Replace the current localStorage logic with real API calls
// ✅ إضافة ميزة التخزين المحلي LocalStorage


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

const LOCAL_STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasksObservable$: Observable<Task[]> = this.tasksSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  private saveToLocalStorage(tasks: Task[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  private loadFromLocalStorage(): Task[] {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  loadTasks(): void {
    const localTasks = this.loadFromLocalStorage();
    if (localTasks.length > 0) {
      this.tasksSubject.next(localTasks);
    }

    // يمكن جعل هذا اختياريًا أو لإعادة التزامن فقط
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
        this.saveToLocalStorage(tasks);
      },
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  addTask(title: string): void {
    const newTask = { title, completed: false };
    this.http.post<Task>(this.apiUrl, newTask).subscribe({
      next: (task) => {
        const current = this.tasksSubject.value;
        const updated = [...current, task];
        this.tasksSubject.next(updated);
        this.saveToLocalStorage(updated);
      },
      error: (err) => console.error('Error adding task:', err)
    });
  }

  toggleTask(id: number): void {
    const current = [...this.tasksSubject.value];
    const task = current.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };

    this.http.put<Task>(`${this.apiUrl}/${id}`, updated).subscribe({
      next: () => {
        const updatedList = current.map(t => (t.id === id ? updated : t));
        this.tasksSubject.next(updatedList);
        this.saveToLocalStorage(updatedList);
      },
      error: (err) => console.error('Error toggling task:', err)
    });
  }

  deleteTask(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        const filtered = this.tasksSubject.value.filter(t => t.id !== id);
        this.tasksSubject.next(filtered);
        this.saveToLocalStorage(filtered);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}

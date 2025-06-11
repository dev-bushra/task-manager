// 🔁 Replace the current localStorage logic with real API calls
// ✅ إضافة ميزة التخزين المحلي LocalStorage

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasksObservable$: Observable<Task[]> = this.tasksSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => this.tasksSubject.next(tasks),
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  addTask(title: string): void {
    const newTask = { title, completed: false };
    this.http.post<Task>(this.apiUrl, newTask).subscribe({
      next: (task) => {
        const current = this.tasksSubject.value;
        this.tasksSubject.next([...current, task]);
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
      },
      error: (err) => console.error('Error toggling task:', err)
    });
  }

  deleteTask(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        const filtered = this.tasksSubject.value.filter(t => t.id !== id);
        this.tasksSubject.next(filtered);
      },
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}
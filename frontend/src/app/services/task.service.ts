// 🔁 Replace the current localStorage logic with real API calls

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasksObservable$: Observable<Task[]> = this.tasksSubject.asObservable();
  private apiUrl = `${environment.apiUrl}tasks`;

  private syncingSubject = new BehaviorSubject<boolean>(false);
  public syncing$ = this.syncingSubject.asObservable();

  private syncQueue: any[] = [];
  private isOnline = navigator.onLine;

  constructor(private http: HttpClient) {
    window.addEventListener('online', () => this.onReconnect());
    this.loadFromLocalStorage(); // ✅ أولوية التحميل من التخزين المحلي
    this.loadFromServer();       // ثم تحميل النسخة الأحدث من السيرفر
  }

  private loadFromLocalStorage(): void {
    const local = localStorage.getItem('tasks');
    if (local) {
      const tasks = JSON.parse(local);
      this.tasksSubject.next(tasks);
    }
  }

  private saveToLocalStorage(tasks: Task[]): void {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  private loadFromServer(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
        this.saveToLocalStorage(tasks);
      },
      error: (err) => console.error('Error loading from server:', err)
    });
  }

  private onReconnect(): void {
    if (this.syncQueue.length > 0) {
      this.syncingSubject.next(true);
      this.processSyncQueue().then(() => {
        this.loadFromServer();
        this.syncingSubject.next(false);
      });
    }
  }

  private async processSyncQueue(): Promise<void> {
    for (const item of this.syncQueue) {
      const { type, data } = item;
      try {
        if (type === 'add') {
          await this.http.post(this.apiUrl, data).toPromise();
        } else if (type === 'toggle') {
          await this.http.put(`${this.apiUrl}/${data.id}`, data).toPromise();
        } else if (type === 'delete') {
          await this.http.delete(`${this.apiUrl}/${data.id}`).toPromise();
        }
      } catch (err) {
        console.error('Sync failed:', err);
      }
    }
    this.syncQueue = [];
  }

  addTask(title: string): void {
    const newTask = { title, completed: false } as Partial<Task>;
    const current = this.tasksSubject.value;

    const optimistic = { ...newTask, id: Date.now() } as Task;
    this.tasksSubject.next([...current, optimistic]);
    this.saveToLocalStorage([...current, optimistic]);

    if (this.isOnline) {
      this.http.post<Task>(this.apiUrl, newTask).subscribe({
        next: () => this.loadFromServer(),
        error: () => this.queueOfflineAction('add', newTask)
      });
    } else {
      this.queueOfflineAction('add', newTask);
    }
  }

  toggleTask(id: number): void {
    const current = this.tasksSubject.value;
    const task = current.find(t => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };
    const updatedList = current.map(t => (t.id === id ? updated : t));
    this.tasksSubject.next(updatedList);
    this.saveToLocalStorage(updatedList);

    if (this.isOnline) {
      this.http.put(`${this.apiUrl}/${id}`, updated).subscribe({
        next: () => this.loadFromServer(),
        error: () => this.queueOfflineAction('toggle', updated)
      });
    } else {
      this.queueOfflineAction('toggle', updated);
    }
  }

  deleteTask(id: number): void {
    const current = this.tasksSubject.value.filter(t => t.id !== id);
    this.tasksSubject.next(current);
    this.saveToLocalStorage(current);

    if (this.isOnline) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadFromServer(),
        error: () => this.queueOfflineAction('delete', { id })
      });
    } else {
      this.queueOfflineAction('delete', { id });
    }
  }

  private queueOfflineAction(type: string, data: any): void {
    this.syncQueue.push({ type, data });
    this.syncingSubject.next(true);
  }
}

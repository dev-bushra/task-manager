// 🔁 Replace the current localStorage logic with real API calls
// 🧠 هدفنا: تطبيق Offline-First بالكامل عبر LocalStorage + قائمة انتظار Sync
// With conflict resolution + sync message broadcast

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

interface SyncAction {
  type: 'add' | 'toggle' | 'delete';
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasksObservable$: Observable<Task[]> = this.tasksSubject.asObservable();
  public syncing$ = new BehaviorSubject<boolean>(false); // 🔄 expose syncing status

  private apiUrl = `${environment.apiUrl}/tasks`;
  private syncQueue: SyncAction[] = [];
  private localStorageKey = 'offline_tasks';
  private syncQueueKey = 'sync_queue';

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
    this.setupSyncOnReconnect();
    this.syncWithServer();
  }

  // ✅ Load from local storage
  private loadFromLocalStorage(): void {
    const tasks = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    this.tasksSubject.next(tasks);
    this.syncQueue = JSON.parse(localStorage.getItem(this.syncQueueKey) || '[]');
  }

  // ✅ Save tasks and sync queue
  private saveToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasksSubject.value));
    localStorage.setItem(this.syncQueueKey, JSON.stringify(this.syncQueue));
  }

  // ✅ Sync trigger on reconnect
  private setupSyncOnReconnect(): void {
    fromEvent(window, 'online').subscribe(() => this.syncWithServer());
  }

  // ✅ Actual sync process
  private syncWithServer(): void {
    if (!navigator.onLine || this.syncQueue.length === 0) return;
    this.syncing$.next(true);

    const queueCopy = [...this.syncQueue];
    const updatedTasks = [...this.tasksSubject.value];

    const processNext = (): void => {
      if (queueCopy.length === 0) {
        this.syncQueue = [];
        this.saveToLocalStorage();
        this.loadFromServer();
        this.syncing$.next(false);
        return;
      }
      const action = queueCopy.shift();
      switch (action!.type) {
        case 'add':
          this.http.post<Task>(this.apiUrl, action!.payload).subscribe({
            next: () => processNext(),
            error: () => processNext(), // 📌 ignore error during sync
          });
          break;
        case 'toggle':
          this.http.put<Task>(`${this.apiUrl}/${action!.payload.id}`, action!.payload).subscribe({
            next: () => processNext(),
            error: () => processNext(),
          });
          break;
        case 'delete':
          this.http.delete(`${this.apiUrl}/${action!.payload.id}`).subscribe({
            next: () => processNext(),
            error: () => processNext(),
          });
          break;
      }
    };

    processNext();
  }

  // ✅ Reload from server (used to resolve conflicts)
  private loadFromServer(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
        this.saveToLocalStorage();
      }
    });
  }

  // ✅ Add task
  addTask(title: string): void {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false
    };
    const current = [...this.tasksSubject.value, newTask];
    this.tasksSubject.next(current);
    this.saveToLocalStorage();

    if (navigator.onLine) {
      this.http.post<Task>(this.apiUrl, newTask).subscribe({
        next: () => this.loadFromServer(),
        error: () => this.queueSync('add', newTask),
      });
    } else {
      this.queueSync('add', newTask);
    }
  }

  toggleTask(id: number): void {
    const current = [...this.tasksSubject.value];
    const task = current.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    const newList = current.map(t => t.id === id ? updated : t);
    this.tasksSubject.next(newList);
    this.saveToLocalStorage();

    if (navigator.onLine) {
      this.http.put<Task>(`${this.apiUrl}/${id}`, updated).subscribe({
        next: () => this.loadFromServer(),
        error: () => this.queueSync('toggle', updated),
      });
    } else {
      this.queueSync('toggle', updated);
    }
  }

  deleteTask(id: number): void {
    const filtered = this.tasksSubject.value.filter(t => t.id !== id);
    this.tasksSubject.next(filtered);
    this.saveToLocalStorage();

    if (navigator.onLine) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.loadFromServer(),
        error: () => this.queueSync('delete', { id }),
      });
    } else {
      this.queueSync('delete', { id });
    }
  }

  // ✅ Queue sync
  private queueSync(type: SyncAction['type'], payload: any): void {
    this.syncQueue.push({ type, payload });
    this.saveToLocalStorage();
    this.syncing$.next(true);
  }
}

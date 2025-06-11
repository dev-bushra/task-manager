// 🔁 Replace the current localStorage logic with real API calls
// 🧠 هدفنا: تطبيق Offline-First بالكامل عبر LocalStorage + قائمة انتظار Sync

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

const LOCAL_STORAGE_KEY = 'tasks';
const SYNC_QUEUE_KEY = 'syncQueue';

interface SyncAction {
  type: 'add' | 'toggle' | 'delete';
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasksObservable$: Observable<Task[]> = this.tasksSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/tasks`;
  
  private isOnline = navigator.onLine;

  constructor(private http: HttpClient) {
    this.initConnectivityListeners();
    this.loadTasks();
  }

  private initConnectivityListeners() {
    // ✅ نراقب تغيّر حالة الاتصال
    merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).subscribe(() => {
      this.isOnline = navigator.onLine;
      if (this.isOnline) {
        this.syncWithServer();
      }
    });
  }

  private saveToLocalStorage(tasks: Task[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  private loadFromLocalStorage(): Task[] {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private getSyncQueue(): SyncAction[] {
    const stored = localStorage.getItem(SYNC_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private updateSyncQueue(queue: SyncAction[]) {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  private enqueueSync(action: SyncAction) {
    const queue = this.getSyncQueue();
    queue.push(action);
    this.updateSyncQueue(queue);
  }

  private syncWithServer() {
    const queue = this.getSyncQueue();
    if (queue.length === 0) return;

    // 🔁 تنفيذ كل عمليات المزامنة واحدة تلو الأخرى
    const processNext = () => {
      if (queue.length === 0) {
        this.updateSyncQueue([]);
        this.loadTasks(); // 🔁 إعادة تحميل البيانات من الخادم بعد التزامن
        return;
      }

      const action = queue.shift()!;
      switch (action.type) {
        case 'add':
          this.http.post<Task>(this.apiUrl, action.payload).subscribe({
            next: () => processNext(),
            error: () => {
              queue.unshift(action);
              this.updateSyncQueue(queue);
            }
          });
          break;
        case 'toggle':
          this.http.put(`${this.apiUrl}/${action.payload.id}`, action.payload).subscribe({
            next: () => processNext(),
            error: () => {
              queue.unshift(action);
              this.updateSyncQueue(queue);
            }
          });
          break;
        case 'delete':
          this.http.delete(`${this.apiUrl}/${action.payload}`).subscribe({
            next: () => processNext(),
            error: () => {
              queue.unshift(action);
              this.updateSyncQueue(queue);
            }
          });
          break;
      }
    };

    processNext();
  }

  loadTasks(): void {
    if (this.isOnline) {
      this.http.get<Task[]>(this.apiUrl).subscribe({
        next: (tasks) => {
          this.tasksSubject.next(tasks);
          this.saveToLocalStorage(tasks);
        },
        error: () => {
          const local = this.loadFromLocalStorage();
          this.tasksSubject.next(local);
        }
      });
    } else {
      const local = this.loadFromLocalStorage();
      this.tasksSubject.next(local);
    }
  }

  addTask(title: string): void {
    const newTask: Task = { id: Date.now(), title, completed: false }; // ⚠️ id مؤقت
    const updatedTasks = [...this.tasksSubject.value, newTask];
    this.tasksSubject.next(updatedTasks);
    this.saveToLocalStorage(updatedTasks);

    if (this.isOnline) {
      this.http.post<Task>(this.apiUrl, newTask).subscribe({
        next: (taskFromServer) => this.loadTasks(),
        error: () => this.enqueueSync({ type: 'add', payload: newTask })
      });
    } else {
      this.enqueueSync({ type: 'add', payload: newTask });
    }
  }

  toggleTask(id: number): void {
    const current = [...this.tasksSubject.value];
    const task = current.find(t => t.id === id);
    if (!task) return;
    const updated = { ...task, completed: !task.completed };
    const updatedList = current.map(t => (t.id === id ? updated : t));
    this.tasksSubject.next(updatedList);
    this.saveToLocalStorage(updatedList);

    if (this.isOnline) {
      this.http.put(`${this.apiUrl}/${id}`, updated).subscribe({
        next: () => {},
        error: () => this.enqueueSync({ type: 'toggle', payload: updated })
      });
    } else {
      this.enqueueSync({ type: 'toggle', payload: updated });
    }
  }

  deleteTask(id: number): void {
    const updatedList = this.tasksSubject.value.filter(t => t.id !== id);
    this.tasksSubject.next(updatedList);
    this.saveToLocalStorage(updatedList);

    if (this.isOnline) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {},
        error: () => this.enqueueSync({ type: 'delete', payload: id })
      });
    } else {
      this.enqueueSync({ type: 'delete', payload: id });
    }
  }
}

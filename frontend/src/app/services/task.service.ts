// 🔁 Replace the current localStorage logic with real API calls

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API = environment.apiUrl + '/tasks';  // 👈 e.g. /tasks

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API);
  }

  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.API, { title });
  }

  toggleTask(id: number): Observable<Task> {
    return this.http.put<Task>(`${this.API}/${id}/toggle`, {});
  }

  removeTask(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
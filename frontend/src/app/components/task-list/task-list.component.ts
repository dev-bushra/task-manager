// 🔁 Update component to work with HTTP service
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  tasksObservable$: Observable<Task[]> = this.taskService.tasksObservable$;
  newTask = '';

  constructor(private taskService: TaskService) { }

  addTask() {
    const trimmed = this.newTask.trim();
    if (trimmed) {
      this.taskService.addTask(trimmed);
      this.newTask = '';
    }
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
  }
}

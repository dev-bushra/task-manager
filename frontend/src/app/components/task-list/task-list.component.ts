import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})

export class TaskListComponent {
  newTask = '';
  tasksObservable$ = this.taskService.tasksObservable$;

  constructor(public taskService: TaskService) {}

  addTask() {
    const task = this.newTask.trim();
    if (task) {
      this.taskService.addTask(task);
      this.newTask = '';
    }
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: number) {
    this.taskService.removeTask(id);
  }
  
}

// 🔁 Update component to work with HTTP service

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  newTask = '';
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data) => (this.tasks = data));
  }

  addTask() {
    const task = this.newTask.trim();
    if (task) {
      this.taskService.addTask(task).subscribe((newTask) => {
        this.tasks.push(newTask);
        this.newTask = '';
      });
    }
  }

  toggleTask(id: number) {
    this.taskService.toggleTask(id).subscribe((updated) => {
      const index = this.tasks.findIndex((t) => t.id === id);
      if (index !== -1) this.tasks[index] = updated;
    });
  }

  deleteTask(id: number) {
    this.taskService.removeTask(id).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    });
  }
}
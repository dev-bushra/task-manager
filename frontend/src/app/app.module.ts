// ✅ app.module.ts — Root Module (App Configuration)
// What it does: It's the main config file of your Angular app. It registers all components, services, and modules.

// ➡️ Angular decorator to define a module.
import { NgModule } from '@angular/core';
// ➡️ Needed to run the app in a browser.
import { BrowserModule } from '@angular/platform-browser';
// ➡️ Imports ???
import { FormsModule } from '@angular/forms';
// ➡️ Imports your root UI component (the one loaded first).
import { AppComponent } from './app.component';

// import component
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskService } from './services/task.service';

// HighCharts
import { HighchartsChartComponent } from 'highcharts-angular';
import { HighchartsChartModule } from 'highcharts-angular';
import { TaskChartComponent } from './components/task-chart/task-chart.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, TaskListComponent, TaskChartComponent],  // Declare all components here
  // declarations: [AppComponent, ClientListComponent],  // Declare all components here
  imports: [BrowserModule, FormsModule, HighchartsChartModule, HttpClientModule ],  // Import other modules (e.g. Forms, Http)
  providers: [TaskService],  // Register services (dependency injection)
  bootstrap: [AppComponent]  // Start the app with this component
})

export class AppModule { }

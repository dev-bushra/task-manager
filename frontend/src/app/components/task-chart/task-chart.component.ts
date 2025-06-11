import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';
import HC_3D from 'highcharts/highcharts-3d';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-chart',
  templateUrl: './task-chart.component.html',
  styleUrls: ['./task-chart.component.css']
})
export class TaskChartComponent implements OnInit, OnDestroy {

  Highcharts: typeof Highcharts = Highcharts;

  // 3D enable 
  HC_3D: typeof HC_3D = HC_3D;
  // HC_3D(highcharts);

  // chart 1 - line chart
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      height: '100%',
      style: {
        fontFamily: 'inherit',
      }
    },
    responsive: { // ✅  Resposives
      rules: [
        {
          condition: {
            maxWidth: 768, // ✅ Mobile devices
          },
          chartOptions: {
            legend: {
              align: 'center',
              verticalAlign: 'bottom',
              layout: 'horizontal',
            }
          }
        }
      ]
    },
    title: { text: '', align: 'center', style: { color: '#2563eb', fontWeight: '500' } },
    // subtitle: { text: 'lorem ipusm text ...' },
    // xAxis: { categories: ['Tasks Summary'] },
    xAxis: { categories: [''] },
    // yAxis: { min: 0, title: { text: 'Count' } },
    yAxis: {
      min: 0,
      title: {
        text: '',
        style: { color: '#555', fontWeight: 'light' }
      },
      gridLineColor: '#f4f4f4',
    },
    // colors: ['#16a34a', '#dc2626'], // ✅ Tailwind green-600 & red-600
    series: [
      {
        name: 'Completed',
        type: 'column',
        data: [0]
      },
      {
        name: 'Incomplete',
        type: 'column',
        data: [0]
      }
    ],
    plotOptions: { // ✅ Column styling with rounded edges
      column: {
        borderRadius: 5,
        pointPadding: 0.2,
        groupPadding: 0.1,
      }
    },
    //     tooltip: {
    //   shared: true,
    //   backgroundColor: '#f9f9f9',
    //   borderColor: '#ccc',
    //   style: { color: '#111' }
    // },
    credits: { enabled: false }, // 👈 removes "highcharts.com"
  };

  // chart 2 - 3D line Chart
  threeDChartOptions: Highcharts.Options = {
    chart: {
      renderTo: 'container',
      type: 'column',
      // backgroundColor: 'black',
      options3d: {
        enabled: true,
        alpha: 5,
        beta: 15,
        depth: 50,
        viewDistance: 25
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: { text: ' ' },
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Cars sold: {point.y}'
    },
    title: {
      text: 'Sold passenger cars in Norway by brand, May 2024'
    },
    subtitle: {
      text: 'Source: ' +
        '<a href="https://ofv.no/registreringsstatistikk"' +
        'target="_blank">OFV</a>'
    },
    legend: {
      enabled: true,
      itemStyle: { color: 'black' }
    },
    plotOptions: { // padding and char spacing
      column: {
        depth: 125,
        pointPadding: 0.3
      },
      series: { gapSize: 1 }
    },
    series: [
      { type: 'column', name: 'Toyota', data: [1795], color: '#1f77b4' },
      { type: 'column', name: 'Volkswagen', data: [1242], color: '#ff7f0e' },
      { type: 'column', name: 'Volvo', data: [1074], color: '#2ca02c' },
      { type: 'column', name: 'Tesla', data: [832], color: '#d62728' },
      { type: 'column', name: 'Hyundai', data: [593], color: '#9467bd' },
      { type: 'column', name: 'MG', data: [509], color: '#8c564b' },
      { type: 'column', name: 'Skoda', data: [471], color: '#e377c2' },
      { type: 'column', name: 'BMW', data: [442], color: '#7f7f7f' },
      { type: 'column', name: 'Ford', data: [385], color: '#bcbd22' },
      { type: 'column', name: 'Nissan', data: [371], color: '#17becf' }
    ]
  }

  // chart 3 - stock chart
  stockChartOptions: Highcharts.Options = {
    title: {
      text: 'Stock Price Over Time',
    },
    series: [
      {
        type: 'line',
        name: 'Stock Price',
        data: [
          [Date.UTC(2023, 0, 1), 29.9],
          [Date.UTC(2023, 1, 1), 71.5],
          [Date.UTC(2023, 2, 1), 106.4],
          [Date.UTC(2023, 3, 1), 129.2],
          [Date.UTC(2023, 4, 1), 144.0],
          [Date.UTC(2023, 5, 1), 176.0],
          [Date.UTC(2023, 6, 1), 135.6],
          [Date.UTC(2023, 7, 1), 148.5],
          [Date.UTC(2023, 8, 1), 216.4],
          [Date.UTC(2023, 9, 1), 194.1],
          [Date.UTC(2023, 10, 1), 95.6],
          [Date.UTC(2023, 11, 1), 54.4],
        ],
      },
    ],
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Price (USD)',
      },
    },
  };

  private taskSub!: Subscription;

  constructor(private taskService: TaskService) { }

  // start listen to task service
  ngOnInit() {
    this.taskSub = this.taskService.tasksObservable$.subscribe(tasks => {
      this.updateChartData(tasks);
    });
  }

  updateChartData(tasks: Task[]) {
    const completed = tasks.filter(t => t.completed).length;
    const incomplete = tasks.length - completed;

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        { name: 'Completed', type: 'column', data: [completed] },
        { name: 'Incomplete', type: 'column', data: [incomplete] }
      ]
    };
  }

  ngOnDestroy() {
    this.taskSub.unsubscribe();
  }
}

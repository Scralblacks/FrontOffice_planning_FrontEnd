import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../services/task/task.service";
import {Observable} from "rxjs";
import {taskDTO} from "../../../models/taskDTO";

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css']
})
export class TaskManagerComponent implements OnInit {

  managedTask$: Observable<taskDTO | null> = this.taskService.managedTask;

  task: taskDTO | null = null;

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.managedTask$.subscribe({
      next: (val) => {
        this.task = val;
        console.log(this.task);
      }
    })
  }

}

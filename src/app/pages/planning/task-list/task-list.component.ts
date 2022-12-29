import {Component, OnInit} from '@angular/core';
import {PlanningService} from "../../../services/planning/planning.service";
import {taskDTO} from "../../../models/taskDTO";
import {Observable} from "rxjs";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  public taskList: taskDTO[] = [];

  public dateSelected!: Date;

  changeDateSelected$: Observable<any> = this.planningService.newDailyTasks;

  constructor(private planningService: PlanningService) {
  }

  ngOnInit(): void {
    this.changeDateSelected$.subscribe({
      next: (data: any) => {
        //this.dateSelected = new Date();
        if (data) {
          this.taskList = [...data.taskDTOList];
          this.dateSelected = new Date(data.dateSelected);
        }
      }
    })
  }

}

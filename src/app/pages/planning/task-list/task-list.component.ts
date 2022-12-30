import {Component, OnInit} from '@angular/core';
import {PlanningService} from "../../../services/planning/planning.service";
import {taskDTO} from "../../../models/taskDTO";
import {Observable} from "rxjs";
import {TaskService} from "../../../services/task/task.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  public taskList: taskDTO[] = [];

  public dateSelected!: Date;

  changeDateSelected$: Observable<any> = this.planningService.newDailyTasks;

  constructor(private planningService: PlanningService, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.changeDateSelected$.subscribe({
      next: (data: any) => {
        if (data) {
          this.taskList = [...data.taskDTOList];
          this.dateSelected = new Date(data.dateSelected);
        }
      }
    })
  }

  setManageTask(id: number | null) {
    if (id) {
      this.taskService.getTaskById(id).subscribe({
        next: (taskdto => console.log("Task to update " + taskdto.idTask))
      })
    } else {
      this.taskService.openEmptyTask();
    }
  }

}

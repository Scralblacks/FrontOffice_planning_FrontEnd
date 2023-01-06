import {Component, Input, OnInit} from '@angular/core';
import {PlanningService} from "../../../services/planning/planning.service";
import {taskDTO} from "../../../models/taskDTO";
import {Observable} from "rxjs";
import {TaskService} from "../../../services/task/task.service";
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @Input()
  readonly: boolean = true;

  @Input()
  planningId: number = 0;

  @Input()
  userId: number = 0;


  changeDateSelected$: Observable<any> = this.planningService.newDailyTasks;
  isOwner$: Observable<boolean> = this.planningService.owner;

  public taskList: taskDTO[] = [];
  public dateSelected!: Date;
  isOwner: boolean = false;

  constructor(private planningService: PlanningService, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.changeDateSelected$.subscribe({
      next: (data: any) => {
        if (data) {
          this.taskList = [...data.taskDTOList];
          this.dateSelected = new Date(data.dateSelected);
          console.log(this.dateSelected);
          console.log(this.taskList);
        }
      }
    });

    this.isOwner$.subscribe({
      next: (val) => {
        this.isOwner = val;
      }
    });
  }

  setManageTask(id: number | null) {
    if (id) {
      if (this.isOwner) {
        this.taskService.getTaskById(id).subscribe({
          next: (taskdto => console.log("Task to update " + taskdto.idTask))
        })
      } else {
        this.taskService.getTaskByIdShare(id, this.userId, this.planningId).subscribe();
      }
    } else {
      this.taskService.switchTaskDetailsDisplay(true);
    }
  }

}

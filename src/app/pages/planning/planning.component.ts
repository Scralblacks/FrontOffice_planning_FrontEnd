import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UserService} from "../../services/user/user.service";
import {planningDTO} from "../../models/planningDTO";
import {PlanningService} from "../../services/planning/planning.service";
import {TaskService} from "../../services/task/task.service";
import {taskDTO} from "../../models/taskDTO";

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  user$: Observable<userDTO | null> = this.userService.user;
  planning$: Observable<planningDTO | null> = this.planningService.planning;
  isManagingTask$: Observable<boolean> = this.taskService.isManagingTask;

  currentUser!: userDTO | null;
  currentPlanning!: planningDTO | null;

  isPlanningLoading: boolean = true;

  constructor(private userService: UserService, private planningService: PlanningService, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.user$.subscribe({
      next: (data) => {
        this.currentUser = data;
      },
    });
    this.planning$.subscribe({
      next: (data) => {
        this.currentPlanning = data;
        /* this.currentPlanning?.taskList.map((taskDTO) => {
           taskDTO.dateTaskStart = new Date(taskDTO.dateTaskStart);
           taskDTO.dateCreated = new Date(taskDTO.dateCreated);
           taskDTO.dateTaskEnd = new Date(taskDTO.dateTaskEnd);
         });*/
        this.isPlanningLoading = false;
      }
    })
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {taskDTO} from "../../../../models/taskDTO";
import {TaskService} from "../../../../services/task/task.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input()
  task!: taskDTO;

  @Input()
  dateSelected!: Date;

  public isAllDay: boolean = false;

  public dateToDisplay: string = "All day"
  isHourModif!: Boolean;

  constructor() {
  }

  ngOnInit(): void {

    this.dateSelected.setHours(0)
    let startOfThisDay: Date = new Date(this.dateSelected);
    this.dateSelected.setHours(23, 59, 59);
    let endOfThisDay: Date = new Date(this.dateSelected.getTime());

    let taskStartPrint = (this.task.dateTaskStart.getHours() + 1) + ":" +
      (this.task.dateTaskStart.getMinutes() < 10 ? "0" + this.task.dateTaskStart.getMinutes() : this.task.dateTaskStart.getMinutes())

    let taskEndPrint = (this.task.dateTaskEnd.getHours() + 1) + ":" +
      (this.task.dateTaskEnd.getMinutes() < 10 ? "0" + this.task.dateTaskEnd.getMinutes() : this.task.dateTaskEnd.getMinutes())

    if (this.task.dateTaskStart < startOfThisDay && this.task.dateTaskEnd > endOfThisDay) {
      this.isAllDay = true;
    } else if (this.task.dateTaskStart < startOfThisDay) {
      this.dateToDisplay = "00:00 - " + taskEndPrint;
    } else if (this.task.dateTaskEnd > endOfThisDay) {
      this.dateToDisplay = taskStartPrint + " - 23:59"
    } else {
      this.dateToDisplay = taskStartPrint + " - " + taskEndPrint;
    }
  }
}

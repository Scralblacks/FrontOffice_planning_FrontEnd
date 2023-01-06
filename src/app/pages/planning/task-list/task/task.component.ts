import {Component, Input, OnInit} from '@angular/core';
import {taskDTO} from "../../../../models/taskDTO";

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

  constructor() {
  }

  ngOnInit(): void {
    let startOfThisDay: Date = new Date(this.dateSelected);
    this.dateSelected.setHours(23, 59, 59);
    let endOfThisDay: Date = new Date(this.dateSelected.getTime());
    this.task.dateTaskStart.setTime(this.task.dateTaskStart.getTime() + 3600000)
    this.task.dateTaskEnd.setTime(this.task.dateTaskEnd.getTime() + 3600000)
    let taskStartPrint = this.task.dateTaskStart.getHours() + ":" +
      (this.task.dateTaskStart.getMinutes() < 10 ? "0" + this.task.dateTaskStart.getMinutes() : this.task.dateTaskStart.getMinutes())
    let taskEndPrint = this.task.dateTaskEnd.getHours() + ":" +
      (this.task.dateTaskEnd.getMinutes() < 10 ? "0" + this.task.dateTaskEnd.getMinutes() : this.task.dateTaskEnd.getMinutes())
    if (this.task.dateTaskStart < startOfThisDay && this.task.dateTaskEnd > endOfThisDay) {
      this.isAllDay = true;
    } else if (this.task.dateTaskStart < startOfThisDay) {
      this.dateToDisplay = "00:00 - " + taskEndPrint;
      // this.timeEnd = this.task.dateTaskEnd.getHours() + ":"
    } else if (this.task.dateTaskEnd > endOfThisDay) {
      this.dateToDisplay = taskStartPrint + " - 23:59"
    } else {
      this.dateToDisplay = taskStartPrint + " - " + taskEndPrint;
    }
  }
}

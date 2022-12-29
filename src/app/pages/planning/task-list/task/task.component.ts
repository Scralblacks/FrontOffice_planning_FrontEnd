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
    if (this.task.dateTaskStart < startOfThisDay && this.task.dateTaskEnd > endOfThisDay) {
      this.isAllDay = true;
    } else if (this.task.dateTaskStart < startOfThisDay) {
      this.dateToDisplay = "00:00 - " + this.task.dateTaskEnd.getHours() + ":" + this.task.dateTaskEnd.getMinutes();
      // this.timeEnd = this.task.dateTaskEnd.getHours() + ":"
    } else if (this.task.dateTaskEnd > endOfThisDay) {
      this.dateToDisplay = this.task.dateTaskStart.getHours() + ":" + this.task.dateTaskStart.getMinutes() + " - 23:59"
    } else {
      this.dateToDisplay = this.task.dateTaskStart.getHours() + ":" + this.task.dateTaskStart.getMinutes() + this.task.dateTaskEnd.getHours() + ":" + this.task.dateTaskEnd.getMinutes();
    }
  }
}

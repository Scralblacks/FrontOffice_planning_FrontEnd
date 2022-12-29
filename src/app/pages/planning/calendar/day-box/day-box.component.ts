import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Day} from "../../../../models/day";
import {taskDTO} from "../../../../models/taskDTO";

@Component({
  selector: 'app-day-box',
  templateUrl: './day-box.component.html',
  styleUrls: ['./day-box.component.css']
})
export class DayBoxComponent implements OnInit {

  @Input()
  day!: Day;

  @Input()
  isCurrentDay: boolean = false;

  @Input()
  isSelectedDay: boolean = false;

  @Input()
  numberOfTask: number = 0;

  @Input()
  taskDTOList: taskDTO[] | undefined = [];

  @Output()
  select = new EventEmitter<Day>();

  constructor() {
  }

  ngOnInit(): void {
  }

  selectListener() {
    this.select.emit(this.day);
  }

}

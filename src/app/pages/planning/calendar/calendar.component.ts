import {Component, OnInit} from '@angular/core';
import {Day} from "../../../models/day";
import {CalendarCreatorService} from "../../../services/calendar-creator/calendar-creator.service";
import {taskDTO} from "../../../models/taskDTO";
import {Observable} from "rxjs";
import {planningDTO} from "../../../models/planningDTO";
import {PlanningService} from "../../../services/planning/planning.service";
import {TaskService} from "../../../services/task/task.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  planning$: Observable<planningDTO | null> = this.planningService.planning;

  taskList: taskDTO[] = [];
  taskMapOfMonth: Map<number, taskDTO[]> = new Map<number, taskDTO[]>();

  public monthDays!: Day[];

  public monthNumber!: number;
  public year!: number;


  public weekDaysName: string[] = [];

  readonly currentDate: Date = new Date();

  public selectedDay: Date = this.currentDate;

  public isReadyToRender: Promise<boolean> = Promise.resolve(false);

  constructor(public calendarCreator: CalendarCreatorService, private planningService: PlanningService, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.setMonthDays(this.calendarCreator.getCurrentMonth());

    this.weekDaysName.push("Lun");
    this.weekDaysName.push("Mar");
    this.weekDaysName.push("Mer");
    this.weekDaysName.push("Jeu");
    this.weekDaysName.push("Ven");
    this.weekDaysName.push("Sam");
    this.weekDaysName.push("Dim");

    this.planning$.subscribe({
      next: (data) => {
        this.taskMapOfMonth.clear();
        this.taskList = data?.taskList ? data?.taskList : [];
        this.taskList.map((taskDTO) => {
          taskDTO.dateTaskStart = new Date(taskDTO.dateTaskStart);
          taskDTO.dateCreated = new Date(taskDTO.dateCreated!);
          taskDTO.dateTaskEnd = new Date(taskDTO.dateTaskEnd);
        });
        this.setTasksOfMonth();
      }
    })

  }

  onNextMonth(): void {
    this.taskMapOfMonth.clear();
    this.monthNumber++;

    if (this.monthNumber == 12) {
      this.monthNumber = 0;
      this.year++;
    }

    this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year));
    this.selectedDay.setMonth(this.monthNumber);
    this.selectedDay.setFullYear(this.year);
    this.setTasksOfMonth();
  }

  onPreviousMonth(): void {
    this.taskMapOfMonth.clear();
    this.monthNumber--;

    if (this.monthNumber < 0) {
      this.monthNumber = 11;
      this.year--;
    }

    this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year));
    this.selectedDay.setMonth(this.monthNumber);
    this.selectedDay.setFullYear(this.year);
    this.setTasksOfMonth();
  }

  private setMonthDays(days: Day[]): void {
    this.monthDays = days;
    this.monthNumber = this.monthDays[0].monthIndex;
    this.year = this.monthDays[0].year;
  }

  private setTasksOfMonth() {

    if (this.taskList) {
      const tempTaskListOfMonth = this.taskList.filter((taskDTO: taskDTO, index) =>
        (taskDTO.dateTaskStart.getFullYear() == this.year || taskDTO.dateTaskEnd.getFullYear() == this.year) && (taskDTO.dateTaskStart.getMonth() == this.monthNumber || taskDTO.dateTaskEnd.getMonth() == this.monthNumber)
      );

      tempTaskListOfMonth.forEach((taskDTO) => {
        let startDate: Date;
        let endDate: Date;
        if (taskDTO.dateTaskStart < new Date(this.year, this.monthNumber) &&
          taskDTO.dateTaskEnd > this.nextMonth(new Date(this.year, this.monthNumber))
        ) {
          startDate = new Date(this.year, this.monthNumber, 1, 1);
          endDate = new Date(this.year, this.monthNumber, this.monthDays.length, 1);

        } else if (taskDTO.dateTaskStart < new Date(this.year, this.monthNumber)) {
          startDate = new Date(this.year, this.monthNumber, 1, 1);
          endDate = new Date(taskDTO.dateTaskEnd);
        } else if (taskDTO.dateTaskEnd > this.nextMonth(new Date(this.year, this.monthNumber))) {
          startDate = new Date(taskDTO.dateTaskStart);
          endDate = new Date(this.year, this.monthNumber, this.monthDays.length, 1);
        } else {
          startDate = new Date(taskDTO.dateTaskStart);
          endDate = new Date(taskDTO.dateTaskEnd);
          if (startDate.getHours() == 0) {
            startDate.setHours(1);
          }
        }
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          if (this.taskMapOfMonth.has(d.getUTCDate())) {
            this.taskMapOfMonth.get(d.getUTCDate())!.push(taskDTO);
          } else {
            this.taskMapOfMonth.set(d.getUTCDate(), [taskDTO]);
          }
        }
      })
      this.isReadyToRender = Promise.resolve(true);
      this.sendTasksToDisplay(this.taskMapOfMonth.has(this.selectedDay.getUTCDate()) ? this.taskMapOfMonth.get(this.selectedDay.getUTCDate()) : []);
    }
  }

  sendTasksToDisplay(taskDTOList: taskDTO[] | undefined) {
    this.planningService.changeDateSelected.next({dateSelected: this.selectedDay, taskDTOList});
  }

  changeSelectedDay(day: Day) {

    const selectedDayLocal = new Date(day.year, day.monthIndex, day.number);
    this.taskService.closeTask();

    if (selectedDayLocal.getDate() == this.currentDate.getDate() && selectedDayLocal.getMonth() == this.currentDate.getMonth() && selectedDayLocal.getFullYear() == this.currentDate.getFullYear()) {
      this.selectedDay = this.currentDate;
      return;
    }

    this.selectedDay = new Date(day.year, day.monthIndex, day.number)
    this.selectedDay.setHours(1);
  }

  nextMonth(date: Date): Date {
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  previousMonth(date: Date): Date {
    date.setMonth(date.getMonth() - 1);
    return date;
  }


}

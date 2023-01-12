import {Injectable} from '@angular/core';
import {Day} from "../../models/day";

@Injectable({
  providedIn: 'root'
})
export class CalendarCreatorService {

  // Storage current year and month index
  private currentYear: number;
  private currentMonthIndex: number

  // Initialize service with current year and month
  constructor() {
    let date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonthIndex = date.getMonth();
  }

  // Retrieves the month which is a list of Day Object
  public getCurrentMonth(): Day[] {
    return this.getMonth(this.currentMonthIndex, this.currentYear);
  }

  // Gets all Day from selected month and year
  public getMonth(monthIndex: number, year: number): Day[] {
    let days = [];

    let firstday = this.createDay(1, monthIndex, year);

    //create empty days
    for (let i = 0; i < firstday.weekDayNumber; i++) {

      days.push({
        weekDayNumber: i,
        monthIndex: monthIndex,
        year: year,
      } as Day);
    }

    days.push(firstday);

    let countDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let i = 2; i < countDaysInMonth + 1; i++) {
      days.push(this.createDay(i, monthIndex, year));
    }
    return days;
  }

  // Gets month name
  public getMonthName(monthIndex: number): string {
    switch (monthIndex) {
      case 0 :
        return "January"
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      case 12:
        return "January";
      default:
        return "|" + monthIndex;
    }
  }

  // Get day name
  public getWeekDayName(weekDay: number): string {
    switch (weekDay) {
      case 0:
        return "Dim"; // Sunday
      case 1:
        return "Lun"; // Monday
      case 2:
        return "Mar"; // Tuesday
      case 3:
        return "Mer"; // Wednesday
      case 4:
        return "Jeu"; // Thursday
      case 5:
        return "Ven"; // Friday
      case 6:
        return "Sam"; // Saturday
      default:
        return "";
    }
  }

  // Generates a new Day object for each day of a month
  private createDay(dayNumber: number, monthIndex: number, year: number) {

    if (new Date(year, monthIndex, dayNumber).getDay() == 0) {
      let day: Day = {
        monthIndex: monthIndex,
        month: this.getMonthName(monthIndex),
        number: dayNumber,
        year: year,
        weekDayNumber: new Date(year, monthIndex, dayNumber).getDay() + 6,
        weekDayName: this.getWeekDayName(new Date(year, monthIndex, dayNumber).getDay()),
      };
      return day;
    } else {
      let day: Day = {
        monthIndex: monthIndex,
        month: this.getMonthName(monthIndex),
        number: dayNumber,
        year: year,
        weekDayNumber: new Date(year, monthIndex, dayNumber).getDay() - 1,
        weekDayName: this.getWeekDayName(new Date(year, monthIndex, dayNumber).getDay()),
      };
      return day;
    }
  }
}

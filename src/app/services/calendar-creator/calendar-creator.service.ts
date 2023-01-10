import {Injectable} from '@angular/core';
import {Day} from "../../models/day";

@Injectable({
  providedIn: 'root'
})
export class CalendarCreatorService {

  private currentYear: number;
  private currentMonthIndex: number

  constructor() {
    let date = new Date();
    this.currentYear = date.getFullYear();
    this.currentMonthIndex = date.getMonth();
  }

  public getCurrentMonth(): Day[] {
    return this.getMonth(this.currentMonthIndex, this.currentYear);
  }

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

  public getMonthName(monthIndex: number): string {
    switch (monthIndex) {
      case 0 :
        return "Janvier"
      case 1:
        return "Février";
      case 2:
        return "Mars";
      case 3:
        return "Avril";
      case 4:
        return "Mai";
      case 5:
        return "Juin";
      case 6:
        return "Juillet";
      case 7:
        return "Août";
      case 8:
        return "Septembre";
      case 9:
        return "Octobre";
      case 10:
        return "Novembre";
      case 11:
        return "Décembre";
      case 12:
        return "Janvier";
      default:
        return "|" + monthIndex;
    }
  }

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

  private createDay(dayNumber: number, monthIndex: number, year: number) {

    if (new Date(year, monthIndex, dayNumber).getDay() == 0){
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

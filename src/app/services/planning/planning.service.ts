import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {planningDTO} from "../../models/planningDTO";
import {taskDTO} from "../../models/taskDTO";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  BASE_URL: string = "http://localhost:8080/api/planning";

  changeDateSelected = new EventEmitter();

  private currentPlanning = new BehaviorSubject<planningDTO | null>(null);

  get planning() {
    return this.currentPlanning.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  getCurrentPlanning(id: number): Observable<any> {
    let url = this.BASE_URL;
    let body = {};
    if (id > 0) {
      url += "/shared";
      // body = ...
      console.log("Get shared planning...");
    } else {
      console.log("Get owners planning...");
    }

    return this.http.get<any>(`${this.BASE_URL}`, body).pipe(
      map((planning: any) => {
        this.currentPlanning.next(planning);
        return planning;
      }),
      catchError((err) => {
        return of(null);
      })
    )
  }
}

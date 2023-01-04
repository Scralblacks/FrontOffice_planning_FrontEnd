import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {planningDTO} from "../../models/planningDTO";
import {taskDTO} from "../../models/taskDTO";
import {shareDTO} from "../../models/shareDTO";
import {setNewShareDTO} from "../../models/setNewShareDTO";
import {ErrorResponse} from "../../models/errorResponse";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {GetSharedPlanning} from "../../models/GetSharedPlanning";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  BASE_URL: string = "http://localhost:8080/api/planning";
  BASE_URL_SHARE: string = "http://localhost:8080/api/share"

  planningStorage!: planningDTO;

  changeDateSelected = new BehaviorSubject<any>(null);
  private currentPlanning = new BehaviorSubject<planningDTO | null>(null);

  // private currentTasks = new BehaviorSubject<taskDTO[] | null>(null);

  get planning() {
    return this.currentPlanning.asObservable();
  }

  get newDailyTasks() {
    return this.changeDateSelected.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  getOwnerPlanning(): Observable<any> {
    console.log("Get owners planning...")
    return this.http.get<planningDTO>(this.BASE_URL).pipe(
      map((planning: planningDTO) => {
        this.planningStorage = planning;
        this.currentPlanning.next(this.planningStorage);
        return planning;
      }),
      catchError((err) => {
        return of(null);
      })
    )
  }

  getSharedPlanning(getPlanningShare: GetSharedPlanning): Observable<any> {
    console.log("Get shared planning...")
    return this.http.get<planningDTO>(`${this.BASE_URL}/shared?idUser=${getPlanningShare.userId}&idPlanning=${getPlanningShare.planningId}`).pipe(
      map((planning: planningDTO) => {
        this.planningStorage = planning;
        this.currentPlanning.next(this.planningStorage);
        return planning;
      }),
      catchError((err) => {
        return of(null);
      })
    )
  }

  addNewTaskLocally(taskDto: taskDTO) {
    this.planningStorage.taskList.push(taskDto);
    this.currentPlanning.next(this.planningStorage)
  }

  updateTaskLocally(taskDto: taskDTO) {
    let itemToUpdate = this.planningStorage.taskList.find(item => item.idTask == taskDto.idTask)!;
    let index = this.planningStorage.taskList.indexOf(itemToUpdate);
    this.planningStorage.taskList[index] = taskDto;
    this.currentPlanning.next(this.planningStorage)
  }

  deleteTaskLocally(id: number) {
    this.planningStorage.taskList.filter(task => task.idTask != id);
    this.currentPlanning.next(this.planningStorage)
  }

  addNewShare(newShareDto: setNewShareDTO) {
    return this.http.post<shareDTO>(`${this.BASE_URL_SHARE}`, newShareDto).pipe(
      map((shareDto) => {
        this.planningStorage.shareList.push(shareDto);
        this.currentPlanning.next(this.planningStorage);
        return shareDto;
      })
    )
  }

  updateShare(shareDto: shareDTO) {
    return this.http.put<shareDTO>(`${this.BASE_URL_SHARE}`, shareDto).pipe(
      map((shareDto: shareDTO) => {
        let itemToUpdate = this.planningStorage.shareList.find(item => item.userId == shareDto.userId)!;
        let index = this.planningStorage.shareList.indexOf(itemToUpdate);
        this.planningStorage.shareList[index] = shareDto;
        this.planningStorage.shareList.push(shareDto);
        this.currentPlanning.next(this.planningStorage);
      })
    )
  }

  deleteShare(shareDto: shareDTO) {
    return this.http.delete<shareDTO>(`${this.BASE_URL_SHARE}?id=${shareDto.planningId}&idUser=${shareDto.userId}`).pipe(
      map((shareDto: shareDTO) => {
        this.planningStorage.shareList.filter(item => item.userId != shareDto.userId);
        this.currentPlanning.next(this.planningStorage);
      })
    )
  }

}

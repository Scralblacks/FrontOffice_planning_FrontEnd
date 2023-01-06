import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {taskDTO} from "../../models/taskDTO";
import {shareDTO} from "../../models/shareDTO";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  BASE_URL: string = "http://localhost:8080/api/task";

  private taskBeingManaged = new BehaviorSubject<taskDTO | null>(null);
  private managingTask = new BehaviorSubject<boolean>(false);

  get managedTask() {
    return this.taskBeingManaged.asObservable();
  }

  get isManagingTask() {
    return this.managingTask.asObservable();
  }


  constructor(private http: HttpClient) {
  }


  getTaskById(id: number): Observable<taskDTO> {
    let url = this.BASE_URL;
    return this.http.get<taskDTO>(`${url}/${id}`).pipe(
      map((taskdto: taskDTO) => {
        this.taskBeingManaged.next(taskdto);
        this.managingTask.next(true);
        return taskdto;
      }));
  }

  getTaskByIdShare(id: number, idUser: number, idPlanning: number): Observable<taskDTO> {
    let url = this.BASE_URL;
    url += "/shared";

    return this.http.get<taskDTO>(`${url}/${id}?idUser=${idUser}&idPlanning=${idPlanning}`).pipe(
      map((taskdto: taskDTO) => {
        this.taskBeingManaged.next(taskdto);
        this.managingTask.next(true);
        return taskdto;
      }));
  }


  switchTaskDetailsDisplay(open: boolean) {
    this.managingTask.next(open);
  }

  addTask(task: taskDTO, isOwner: boolean): Observable<taskDTO> {
    let url = this.BASE_URL;
    if (!isOwner) {
      url += "/shared";
    }
    return this.http.post<taskDTO>(`${url}`, task).pipe(
      map(res => {
        this.taskBeingManaged.next(null);
        this.managingTask.next(false);
        return res;
      })
    )
  };

  closeTask() {
    this.taskBeingManaged.next(null);
    this.managingTask.next(false);
  }

  updateTask(task: taskDTO, isOwner: boolean): Observable<taskDTO> {
    let url = this.BASE_URL;
    if (!isOwner) {
      url += "/shared";
    }
    return this.http.put<taskDTO>(`${url}/edit`, task).pipe(
      map(res => {
        this.taskBeingManaged.next(null);
        this.managingTask.next(false);
        return res;
      })
    )
  }

  deleteTask(id: number) {
    let url = this.BASE_URL;
    return this.http.delete<any>(`${url}/delete/${id}`).pipe(
      map(res => {
        console.log('looooooooool');
        console.log(res);
        this.taskBeingManaged.next(null);
        this.managingTask.next(false);
      })
    )
  }

  deleteTaskShared(id: number, idUser: number, idPlanning:number) {
    let url = this.BASE_URL;
    url += "/shared";
    return this.http.delete<any>(`${url}/delete/${id}?idUser=${idUser}&idPlanning=${idPlanning}`).pipe(
      map(res => {
        console.log('looooooooool');
        console.log(res);
        this.taskBeingManaged.next(null);
        this.managingTask.next(false);
      })
    )
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {taskDTO} from "../../models/taskDTO";

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
    return this.http.get<taskDTO>(`${this.BASE_URL}/${id}`).pipe(
      map((taskdto: taskDTO) => {
        this.taskBeingManaged.next(taskdto);
        this.managingTask.next(true);
        return taskdto;
      }));
  }

  switchTaskDetailsDisplay(open: boolean) {
    this.managingTask.next(open);
  }

  addTask(task: taskDTO): Observable<taskDTO> {
    return this.http.post<taskDTO>(`${this.BASE_URL}`, task).pipe(
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

  updateTask(task: taskDTO): Observable<taskDTO> {
    return this.http.put<taskDTO>(`${this.BASE_URL}/edit`, task).pipe(
      map(res => {
        this.taskBeingManaged.next(null);
        this.managingTask.next(false);
        return res;
      })
    )
  }

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.BASE_URL}/delete/${id}`).pipe(
      map(res => {
        console.log('looooooooool');
        console.log(res);
        this.taskBeingManaged.next(null);
        this.managingTask.next(false);
      })
    )
  }
}

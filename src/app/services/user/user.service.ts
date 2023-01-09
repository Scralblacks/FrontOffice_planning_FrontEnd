import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {GetSharedUsers} from "../../models/GetSharedUsers";
import {sharedUsersDTO} from "../../models/sharedUsersDTO";
import {UpdateUserDTO} from "../../models/updateUserDTO";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_URL: string = "http://localhost:8080/api/users";

  private connectedUser = new BehaviorSubject<userDTO | null>(null);
  private sharedUser = new BehaviorSubject<sharedUsersDTO[] | null>(null);

  get user() {
    return this.connectedUser.asObservable();
  }

  get usersShared() {
    return this.sharedUser.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  getLoggedUser(): Observable<userDTO | null> {
    console.log('getLoggedUser...');
    return this.http.get<userDTO>(`${this.BASE_URL}`).pipe(
      map((user) => {
        console.log('Map getloggedUser');
        console.log(user);
        this.connectedUser.next(user);
        return user;
      }),
      catchError((err) => {
        console.log(err);
        window.sessionStorage.clear();
        return of(null);
      })
    )
  }

  getUserById(id: number) {
    return this.http.get(`${this.BASE_URL}/id/${id}`)
  }

  getSharedUsers(sharedUsers: GetSharedUsers) {
    return this.http.post<sharedUsersDTO[]>(`${this.BASE_URL}/shared`, sharedUsers).pipe(
      map((sharedUsersDto) => {
        this.sharedUser.next(sharedUsersDto);
        return sharedUsersDto;
      })
    )
  }

  updateUser(updateUserDTO: UpdateUserDTO) {
    return this.http.put<userDTO>(`${this.BASE_URL}`, updateUserDTO).pipe(
      map((returnedUserDto) => {
        console.log("returned user after update");
        console.log(returnedUserDto);
        this.connectedUser.next(returnedUserDto);
      })
    )
  }

  upload(file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post(`http://localhost:8080/api/images/upload`, formData, {
      reportProgress: true,
      responseType: 'blob'
    }).pipe(map((fileUploaded) => {
      return fileUploaded
    }))
  }

  getFile(filename: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/images/${filename}`, {responseType: 'blob'});
  }

  deleteUserById(id : number | undefined): Observable<any>{
    if (id != undefined){
    return this.http.delete(`http://localhost:8080/api/users/${id}`)
    } else {
      throw new Error("User not found")
    }
  }
}

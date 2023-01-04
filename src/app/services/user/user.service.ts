import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {GetSharedUsers} from "../../models/GetSharedUsers";
import {sharedUsersDTO} from "../../models/sharedUsersDTO";

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


}

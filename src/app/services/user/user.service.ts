import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {userDTO} from "../../models/userDTO";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_URL: string = "http://localhost:8080/api/users";

  private connectedUser = new BehaviorSubject<userDTO | null>(null);

  get user() {
    return this.connectedUser.asObservable();
  }

  constructor(private http: HttpClient) {
  }

  getLoggedUser(): Observable<any> {
    console.log('getLoggedUser...');
    return this.http.get<any>(`${this.BASE_URL}`).pipe(
      map((user: any) => {
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
    return this.http.get(`http://localhost:8080/api/users/id/${id}`)
  }


}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map} from "rxjs";
import {AuthStorageService} from "../auth-storage/auth-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = "http://localhost:8080/api/auth"
  private loggedIn = new BehaviorSubject<boolean>(!!this.authStorage.getToken())

  get isLoggedIn(){
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient, private authStorage: AuthStorageService) { }

  login(userEmail: string, password: string) {
    const signinRequest = {userEmail, password}
    return this.http.post<any>(`${this.BASE_URL}/signin`, signinRequest)
      .pipe(
        map((jwtResponse: any) => {
          this.authStorage.saveToken(jwtResponse.token);
          this.authStorage.saveEmail(jwtResponse.userName);
          this.loggedIn.next(true);
          return true;
        }),
        catchError((err) => {
          throw new Error(`error login for ${userEmail}`)
        })
      );
  }
}

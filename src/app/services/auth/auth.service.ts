import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map} from "rxjs";
import {AuthStorageService} from "../auth-storage/auth-storage.service";
import {UserDTO} from "../../component/models/userDTO";
import {SignupRequest} from "../../component/models/signupRequest";
import {SigninRequest} from "../../component/models/signinRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = "http://localhost:8080/api/auth"
  private loggedIn = new BehaviorSubject<boolean>(!!this.authStorage.getToken())

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient, private authStorage: AuthStorageService) {
  }

  login(signinRequest: SigninRequest) {
    return this.http.post<any>(`${this.BASE_URL}/signin`, signinRequest)
      .pipe(
        map((jwtResponse: any) => {
          this.authStorage.saveToken(jwtResponse.token);
          this.authStorage.saveEmail(jwtResponse.userName);
          this.loggedIn.next(true);
          return true;
        }),
        catchError((err) => {
          throw new Error(`error login for ${signinRequest.email}`)
        })
      );
  }

  register(signupRequest: SignupRequest) {
    return this.http.post<any>(`${this.BASE_URL}/signup`, signupRequest)
      .pipe(
        map((data: any) => {
          console.log(data);
          return true;
        }),
        catchError((err) => {
          console.log(err);
          throw new Error(`error signup for ${signupRequest.email}`)
        })
      );
  }


}

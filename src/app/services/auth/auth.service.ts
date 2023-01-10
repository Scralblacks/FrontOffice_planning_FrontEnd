import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map} from "rxjs";
import {AuthStorageService} from "../auth-storage/auth-storage.service";
import {SignupRequest} from "../../models/signupRequest";
import {SigninRequest} from "../../models/signinRequest";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL to access auth route
  BASE_URL = `${environment.apiUrl}/auth`;

  // Login Observable
  private loggedIn = new BehaviorSubject<boolean>(!!this.authStorage.getToken())

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private http: HttpClient, private authStorage: AuthStorageService, private router: Router) {
  }

  /**
   * Allows users to log in to the app
   * @param signinRequest Object taking email and password from input
   */
  login(signinRequest: SigninRequest) {
    return this.http.post<any>(`${this.BASE_URL}/signin`, signinRequest)
      .pipe(
        map((jwtResponse: any) => {
          this.authStorage.saveToken(jwtResponse.token);
          this.loggedIn.next(true);
          return true;
        }),
        catchError((err) => {
          throw new Error(`error login for ${signinRequest.email}`)
        })
      );
  }

  /**
   * Allows users to register
   * @param signupRequest Object with multiple fields for registering
   */
  register(signupRequest: SignupRequest) {
    return this.http.post<any>(`${this.BASE_URL}/signup`, signupRequest)
      .pipe(
        map((data: any) => {
          return true;
        }),
        catchError((err) => {
          console.log(err);
          throw new Error(`error signup for ${signupRequest.email}`)
        })
      );
  }

  /**
   * Allows users to logout. Clears the session
   */
  logout(){
    this.loggedIn.next(false);
    this.authStorage.clearSession();
    this.router.navigate(["/login"])
  }


}

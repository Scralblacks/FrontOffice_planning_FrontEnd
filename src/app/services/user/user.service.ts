import {Injectable} from '@angular/core';
import {User} from "../../component/models/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_URL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) {
  }

  save(user: User) {
    return this.http.post(`${this.BASE_URL}/auth/signup`, user)
  }
}

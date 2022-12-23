import { Injectable } from '@angular/core';
import {User} from "../../component/models/user";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  save(user: User) {
    return this.http.post(`http://localhost:8080/`, user)
  }
}

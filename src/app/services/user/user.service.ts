import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {GetSharedUsers} from "../../models/GetSharedUsers";
import {sharedUsersDTO} from "../../models/sharedUsersDTO";
import {UpdateUserDTO} from "../../models/updateUserDTO";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_URL_USER: string = `${environment.apiUrl}/users`;
  BASE_URL_IMAGES: string = `${environment.apiUrl}/images`;

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
    return this.http.get<userDTO>(`${this.BASE_URL_USER}`).pipe(
      map((user) => {
        this.connectedUser.next(user);
        return user;
      }),
      catchError((err) => {
        window.sessionStorage.clear();
        return of(null);
      })
    )
  }

  getUserById(id: number) {
    return this.http.get(`${this.BASE_URL_USER}/id/${id}`)
  }

  getSharedUsers(sharedUsers: GetSharedUsers) {
    return this.http.post<sharedUsersDTO[]>(`${this.BASE_URL_USER}/shared`, sharedUsers).pipe(
      map((sharedUsersDto) => {
        this.sharedUser.next(sharedUsersDto);
        return sharedUsersDto;
      })
    )
  }

  updateUser(updateUserDTO: UpdateUserDTO) {
    return this.http.put<userDTO>(`${this.BASE_URL_USER}`, updateUserDTO).pipe(
      map((returnedUserDto) => {
        this.connectedUser.next(returnedUserDto);
      })
    )
  }

  upload(file: File) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post(`${this.BASE_URL_IMAGES}/upload`, formData, {
      reportProgress: true,
      responseType: 'blob'
    }).pipe(map((fileUploaded) => {
      this.connectedUser.value!.photo! = file.name;
      this.connectedUser.next(this.connectedUser.value);
      return fileUploaded
    }))
  }

  getFile(filename: string): Observable<any> {
    return this.http.get(`${this.BASE_URL_IMAGES}/${filename}`, {responseType: 'blob'});
  }

  deleteUserById(id: number | undefined): Observable<any> {
    if (id != undefined) {
      return this.http.delete(`${this.BASE_URL_USER}/${id}`)
    } else {
      throw new Error("User not found")
    }
  }
}

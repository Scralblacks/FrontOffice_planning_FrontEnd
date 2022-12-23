import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  private static readonly TOKEN_KEY = "auth-token";
  private static readonly EMAIL_KEY = "auth-user";

  constructor() { }

  saveToken(token: string){
    window.sessionStorage.setItem(AuthStorageService.TOKEN_KEY, token)
  }

  getToken(){
    return window.sessionStorage.getItem(AuthStorageService.TOKEN_KEY);
  }

  saveEmail(email: string){
    window.sessionStorage.setItem(AuthStorageService.EMAIL_KEY, email)
  }

  getEmail(){
    const user = window.sessionStorage.getItem(AuthStorageService.EMAIL_KEY);
    return user ? JSON.parse(user) : null;
  }

  clearSession(){
    window.sessionStorage.clear();
  }
}

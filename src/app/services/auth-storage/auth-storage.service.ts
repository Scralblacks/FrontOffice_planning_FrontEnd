import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  private static readonly TOKEN_KEY = "auth-token";
  
  constructor() { }

  saveToken(token: string){
    window.sessionStorage.setItem(AuthStorageService.TOKEN_KEY, token)
  }

  getToken(){
    return window.sessionStorage.getItem(AuthStorageService.TOKEN_KEY);
  }

  clearSession(){
    window.sessionStorage.clear();
  }
}

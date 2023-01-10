import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  // Key name giving for the token saved in local session storage
  private static readonly TOKEN_KEY = "auth-token";

  constructor() { }

  // Add a new item (token) to the local storage (used on log in)
  saveToken(token: string){
    window.sessionStorage.setItem(AuthStorageService.TOKEN_KEY, token)
  }

  // Retrieves user's token for navigating across the app
  getToken(){
    return window.sessionStorage.getItem(AuthStorageService.TOKEN_KEY);
  }

  // Remove the token from the session storage (used for logout purpose)
  clearSession(){
    window.sessionStorage.removeItem(AuthStorageService.TOKEN_KEY);
  }
}

import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UserService} from "../../services/user/user.service";
import {MeteoService} from "../../services/meteo/meteo.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user$: Observable<userDTO | null> = this.userService.user

  meteoData$ = this.meteoService.meteoData


  constructor(private http: HttpClient, private meteoService: MeteoService, private userService: UserService) { }

  ngOnInit() {

    this.user$.subscribe({
      next: (user) => {
        if (user) {
          if (user.addressDTO != undefined) {
            this.meteoService.getWeather(user.addressDTO.postalCode);
          }
        }
      }
    })
  }
}

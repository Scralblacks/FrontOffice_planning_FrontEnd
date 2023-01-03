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


  constructor(private http: HttpClient, protected meteoService: MeteoService, private userService: UserService) { }

  ngOnInit() {

    let meteoData!: any

    // Version with address from user
    this.user$.subscribe({
      next: (user) => {
        if (user) {
          if (user.addressDTO != undefined) {
            meteoData = this.meteoService.getWeather(user.addressDTO.postalCode);
          }
        }
      }
    })

    // this.meteoService.getCoordonate({city: "Tavaux", postalCode: "39500"})
    // this.coordinate$.subscribe({
    //   next: (coordinate) => {
    //     if (coordinate) {
    //       let promMeteoData = this.meteoService.getWeather(coordinate);
    //       let meteoData = promMeteoData.then(data => {
    //           return data
    //         }
    //       );
    //       console.log("meteoData : " + meteoData)
    //     }
    //   }
    // })

   /* let meteoData = this.meteoService.getWeather({latitude: 47.0405, longitude: 5.4008}).subscribe({
      next: (data) => {
        console.log(data)
        meteoData = data
      }
    })*/

  }
}

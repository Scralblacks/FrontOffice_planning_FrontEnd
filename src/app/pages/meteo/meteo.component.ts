import {Component, OnInit} from '@angular/core';
import {MeteoService} from "../../services/meteo/meteo.service";
import {UserService} from "../../services/user/user.service";
import {BehaviorSubject, Observable} from "rxjs";
import {AddressDTO} from "../../models/addressDTO";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  nextTimeTS: number = 0;
  meteoData$: Observable<any> = this.meteoService.meteoData
  user$ = this.userService.user
  address! : AddressDTO
  formChangeTown = new FormControl
  constructor(protected meteoService: MeteoService, private userService: UserService) {
  }

  async ngOnInit(): Promise<void> {

    let now: number = Date.now()
    if (now >= this.nextTimeTS){
      this.userService.user.subscribe({
        next: (user) => {
          if (user && user.addressDTO) {
            this.address = user.addressDTO
            this.meteoService.getWeather(user.addressDTO.postalCode)
          }
        }
      })
      // this.meteoData$.subscribe({
      //   next : (data) => {
      //     console.log(data)
      //     this.nextTimeTS = data.list[1].dt;
      //     this.rainProb$.next(data.list[0].pop * 100)
      //   }
      // })
    }
  }
  }

import {Component, OnInit} from '@angular/core';
import {MeteoService} from "../../services/meteo/meteo.service";
import {UserService} from "../../services/user/user.service";
import {AddressDTO} from "../../models/addressDTO";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.css']
})
export class MeteoComponent implements OnInit {

  nextTimeTS: number = 0;
  tomorrow!: number;
  afterTomorrow!: number;
  today!: Date
  meteoData$ = this.meteoService.meteoData
  tempMeteoData$ = this.meteoService.tempMeteoData
  isTempMeteo! : Observable<boolean | null>
  zipNotFound$ = new BehaviorSubject<boolean>(false)
  tempZipcode$ = this.meteoService.zipcode
  user$ = this.userService.user
  address!: AddressDTO
  formChangeTown = new FormGroup({
    zipCode: new FormControl("", [Validators.required, Validators.minLength(5), Validators.maxLength(5)])
  })

  constructor(private meteoService: MeteoService, private userService: UserService, private toastr: ToastrService) {
  }

  async ngOnInit(): Promise<void> {

    let now: number = Math.round(Date.now()/1000)
    this.today = new Date()
    this.tomorrow = this.today.setDate(this.today.getDate() + 1)
    this.afterTomorrow = this.today.setDate(this.today.getDate() + 1)
    this.zipNotFound$.next(false)
    if (now >= this.nextTimeTS) {
      this.user$.subscribe({
        next: (user) => {
          if (user && user.addressDTO) {
            this.address = user.addressDTO
            this.meteoService.getWeather(this.address.postalCode)
          }
        }
      })
      this.meteoData$.subscribe({
        next: (data) => {
          this.nextTimeTS = data.list[1].dt;
        }
      })
    }
    this.tempMeteoData$.subscribe({
      next: data => {
        if (data){
          if (data.cod == null || data.cod == '404') {
            this.toastr.error("Invalid zipcode")
            this.isTempMeteo = this.meteoService.notTempMeteo
          } else {
            this.isTempMeteo = this.meteoService.isTempMeteo
          }
        }
      }
    })
  }

  submitNewTown(){
    const zipcode = this.formChangeTown.value.zipCode

    if (zipcode){
      this.meteoService.getTempWeather(zipcode);
      // this.isTempMeteo = this.meteoService.isTempMeteo;
    }
  }

  onClickResetTown(){
    this.isTempMeteo = this.meteoService.notTempMeteo;
  }
}

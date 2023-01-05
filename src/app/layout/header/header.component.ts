import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MeteoService} from "../../services/meteo/meteo.service";
import {Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output("onTriggerSidenav")
  trigger = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private meteoService: MeteoService, private userService: UserService) { }

  user$: Observable<userDTO | null> = this.userService.user

  meteoData$ = this.meteoService.meteoData

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

  triggerSidebar() {
    this.trigger.emit();
  }


}

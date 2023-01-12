import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MeteoService} from "../../services/meteo/meteo.service";
import {Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../../services/user/user.service";
import {AuthService} from "../../services/auth/auth.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output("onTriggerSidenav")
  trigger = new EventEmitter<boolean>();

  ownerPicture: SafeUrl = "/assets/profilePicture/neutral_avatar.png";

  activeTab: string = 'planning';

  constructor(private http: HttpClient, private meteoService: MeteoService, private userService: UserService, private authService: AuthService, private sanitizer: DomSanitizer) {
  }

  user$: Observable<userDTO | null> = this.userService.user

  meteoData$ = this.meteoService.meteoData;

  setActivateTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit() {
    this.user$.subscribe({
      next: (user) => {
        if (user) {
          if (user.addressDTO != undefined) {
            this.meteoService.getWeather(user.addressDTO.postalCode);
          }
          if (user.photo) {
            this.userService.getFile(user.photo).subscribe({
              next: (blobImg: Blob) => {
                this.ownerPicture = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
              }
            })
          }
        }
      }
    })
  }

  triggerSidebar() {
    this.trigger.emit();
  }

  onLogout() {
    this.authService.logout()
  }
}

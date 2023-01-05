import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {PlanningService} from "../../services/planning/planning.service";
import {switchMap} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})
export class ContentLayoutComponent implements OnInit {

  @ViewChild("sidebar", {static: false})
  sidebarEl!: ElementRef;

  constructor(private userService: UserService, private planningService: PlanningService, private authService: AuthService) {
  }

  ngOnInit(): void {
    console.log('Init Content Layout...')
    this.userService.getLoggedUser().pipe(
      switchMap(user => {
        // if(!user) return this.planningService.getCurrentPlanning(0)
        return this.planningService.getOwnerPlanning()
      })
    ).subscribe();
    console.log(this.userService.user);
  }

  triggerSidenav() {
    this.sidebarEl.nativeElement.classList.contains("is-active") ?
      this.sidebarEl.nativeElement.classList.remove("is-active") :
      this.sidebarEl.nativeElement.classList.add("is-active")
  }

  onLogout(){
    this.authService.logout()
  }


}

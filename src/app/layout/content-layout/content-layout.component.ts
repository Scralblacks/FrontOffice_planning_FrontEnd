import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {PlanningService} from "../../services/planning/planning.service";
import {catchError, Observable, switchMap} from "rxjs";
import {AuthService} from "../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {GetSharedPlanning} from "../../models/GetSharedPlanning";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})
export class ContentLayoutComponent implements OnInit {

  @ViewChild("sidebar", {static: false})
  sidebarEl!: ElementRef;

  constructor(private userService: UserService, private planningService: PlanningService, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  // ngOnInit(): void {
  //   this.userService.getLoggedUser().pipe(
  //     switchMap(user => {
  //       return this.planningService.getOwnerPlanning()
  //     })
  //   ).subscribe();
  // }


  ngOnInit(): void {
    this.userService.getLoggedUser().pipe(
      switchMap(user => {
        const baseUrl = this.router.url.split('?')[0];
        if (baseUrl == "/planning" && this.route.snapshot.queryParams["id"]) {
          const getSharedPlanning: GetSharedPlanning = {
            userId: user?.idUser!,
            planningId: Number(this.route.snapshot.queryParams["id"])
          }
          return this.planningService.getSharedPlanning(getSharedPlanning)
        } else {
          return this.planningService.getOwnerPlanning()
        }
      }),
      catchError((err) => {

        this.router.navigate(["/planning"]);
        return this.planningService.getOwnerPlanning()
      })
    ).subscribe();
  }

  triggerSidenav() {
    this.sidebarEl.nativeElement.classList.contains("is-active") ?
      this.sidebarEl.nativeElement.classList.remove("is-active") :
      this.sidebarEl.nativeElement.classList.add("is-active")
  }

  onLogout() {
    this.authService.logout()
  }


}

import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {PlanningService} from "../../services/planning/planning.service";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})
export class ContentLayoutComponent implements OnInit {

  constructor(private userService: UserService, private planningService: PlanningService) {
  }

  ngOnInit(): void {
    console.log('Init Content Layout...')
    this.userService.getLoggedUser().pipe(
      switchMap(user => {
        return this.planningService.getCurrentPlanning(0)
      })
    ).subscribe();
    console.log(this.userService.user);
  }

}

import {Component, OnInit} from '@angular/core';
import {map, Observable, Subscription, switchMap} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UserService} from "../../services/user/user.service";
import {planningDTO} from "../../models/planningDTO";
import {PlanningService} from "../../services/planning/planning.service";
import {TaskService} from "../../services/task/task.service";
import {taskDTO} from "../../models/taskDTO";
import {GetSharedUsers} from "../../models/GetSharedUsers";
import {shareDTO} from "../../models/shareDTO";
import {setNewShareDTO} from "../../models/setNewShareDTO";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ModalComponent} from "../../layout/modal/modal.component";
import {sharedUsersDTO} from "../../models/sharedUsersDTO";
import {GetSharedPlanning} from "../../models/GetSharedPlanning";

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  user$: Observable<userDTO | null> = this.userService.user;
  planning$: Observable<planningDTO | null> = this.planningService.planning;
  isManagingTask$: Observable<boolean> = this.taskService.isManagingTask;
  usersShared$: Observable<sharedUsersDTO[] | null> = this.userService.usersShared;

  currentUser!: userDTO | null;
  currentPlanning!: planningDTO | null;
  currentSharedUsers!: sharedUsersDTO[] | null;

  formAddShare!: FormGroup;

  isPlanningLoading: boolean = true;

  private _planningSubscription!: Subscription;
  private _sharedUsersSubscription!: Subscription;

  constructor(private userService: UserService, private planningService: PlanningService, private taskService: TaskService, private formBuilder: FormBuilder, private toastr: ToastrService, private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.formAddShare = this.formBuilder.group({
      emailShare: new FormControl("", [Validators.required, Validators.email])
    });
    this.user$.subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log("Current User :")
        console.log(this.currentUser);
      },
    });
    this.usersShared$.subscribe({
      next: (data) => {
        console.log("Cool de nouveau partage !")
        this.currentSharedUsers = data;
        console.log(this.currentSharedUsers);
        this.isPlanningLoading = false;
      }
    })
    this.planning$.pipe(
      switchMap((planning, index) => {
        console.log("subscribing to new planning lol")
        this.currentPlanning = planning;
        console.log(this.currentPlanning);
        const shared: GetSharedUsers = {
          idPlanning: this.currentPlanning?.idPlanning!,
          sharedIdList: this.currentPlanning?.shareList.map(value => value.userId)!
        }
        if (this.currentPlanning?.idPlanning) {
          this.userService.getSharedUsers(shared).subscribe();
        }
        return new Observable();
      })
    ).subscribe();
  }

  onNextPlanning(): void {


    if (this.currentUser?.sharedPlanningId?.length! == 0) {
      return;
    }

    let indexShareDto = this.currentUser?.sharedPlanningId!.findIndex((planningId) => {
      return planningId == this.currentPlanning?.idPlanning
    })

    indexShareDto!++;

    if (indexShareDto == this.currentUser?.sharedPlanningId?.length!) {
      this.planningService.getOwnerPlanning().subscribe();
    } else {
      const planningIdToGet = this.currentUser?.sharedPlanningId![indexShareDto!];
      const getPlanningShare: GetSharedPlanning = {
        userId: this.currentUser?.idUser!,
        planningId: planningIdToGet!,

      }
      this.planningService.getSharedPlanning(getPlanningShare).subscribe();
    }
  }

  onPreviousPlanning(): void {

    if (this.currentUser?.sharedPlanningId?.length! == 0) {
      return;
    }
    let indexShareDto = this.currentUser?.sharedPlanningId!.findIndex((planningId) => {
      return planningId == this.currentPlanning?.idPlanning
    })
    if (indexShareDto == -1) {
      indexShareDto = this.currentUser?.sharedPlanningId?.length!

    }
    if (indexShareDto == 0) {
      this.planningService.getOwnerPlanning().subscribe();
      return;
    }

    indexShareDto!--;

    const planningIdToGet = this.currentUser?.sharedPlanningId![indexShareDto!];
    const getPlanningShare: GetSharedPlanning = {
      userId: this.currentUser?.idUser!,
      planningId: planningIdToGet!,
    }


    this.planningService.getSharedPlanning(getPlanningShare).subscribe();


    /*  this.taskMapOfMonth.clear();
      this.monthNumber--;

      if (this.monthNumber < 1) {
        this.monthNumber = 12;
        this.year--;
      }

      this.setMonthDays(this.calendarCreator.getMonth(this.monthNumber, this.year));
      this.selectedDay.setMonth(this.monthNumber);
      this.selectedDay.setFullYear(this.year);
      this.setTasksOfMonth();*/
  }

  submitNewShare() {
    if (this.formAddShare.valid) {
      const newShareDto: setNewShareDTO = {
        email: this.formAddShare.value.emailShare,
        planningId: this.currentPlanning?.idPlanning!,
        isReadOnly: true,

      }
      this.planningService.addNewShare(newShareDto).subscribe({
        next: (shareDto) => {
          this.currentPlanning?.shareList.push(shareDto);
          this.formAddShare.reset();
        }
      })
    } else {
      this.toastr.error("Invalid email")
    }

  }

  openListSharedDetailed() {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: this.currentSharedUsers,
      width: "500px",
      maxHeight: "500px",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

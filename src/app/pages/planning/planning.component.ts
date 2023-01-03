import {Component, OnInit} from '@angular/core';
import {Observable, switchMap} from "rxjs";
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

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

  user$: Observable<userDTO | null> = this.userService.user;
  planning$: Observable<planningDTO | null> = this.planningService.planning;
  isManagingTask$: Observable<boolean> = this.taskService.isManagingTask;

  currentUser!: userDTO | null;
  currentPlanning!: planningDTO | null;
  currentSharedUsers!: sharedUsersDTO[] | null;

  formAddShare!: FormGroup;

  isPlanningLoading: boolean = true;

  constructor(private userService: UserService, private planningService: PlanningService, private taskService: TaskService, private formBuilder: FormBuilder, private toastr: ToastrService, private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.formAddShare = this.formBuilder.group({
      emailShare: new FormControl("", [Validators.required, Validators.email])
    });
    this.user$.subscribe({
      next: (data) => {
        this.currentUser = data;
      },
    });
    this.planning$.pipe(
      switchMap((planning, index) => {
        this.currentPlanning = planning;
        const shared: GetSharedUsers = {
          idPlanning: this.currentPlanning?.idPlanning!,
          sharedIdList: this.currentPlanning?.shareList.map(value => value.userId)!

        }
        this.currentPlanning?.idPlanning && this.userService.getSharedUsers(shared).subscribe({
          next: (people) => {
            this.currentSharedUsers = people;
            this.isPlanningLoading = false;
          }
        });
        return new Observable();
      })
    ).subscribe();
    /*this.planning$.subscribe({
      next: (data) => {
        this.currentPlanning = data;
        console.log(this.currentPlanning)
        this.isPlanningLoading = false;
      }
    })*/
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

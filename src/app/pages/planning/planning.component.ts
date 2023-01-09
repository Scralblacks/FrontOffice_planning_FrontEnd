import {Component, HostListener, OnInit} from '@angular/core';
import {Observable, Subscription, switchMap} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UserService} from "../../services/user/user.service";
import {planningDTO} from "../../models/planningDTO";
import {PlanningService} from "../../services/planning/planning.service";
import {TaskService} from "../../services/task/task.service";
import {GetSharedUsers} from "../../models/GetSharedUsers";
import {setNewShareDTO} from "../../models/setNewShareDTO";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {MatDialog,} from '@angular/material/dialog';
import {sharedUsersDTO} from "../../models/sharedUsersDTO";
import {GetSharedPlanning} from "../../models/GetSharedPlanning";
import {ShareManagerComponent} from "./share-manager/share-manager.component";
import {shareDTO} from "../../models/shareDTO";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ErrorResponse} from "../../models/errorResponse";
import {taskDTO} from "../../models/taskDTO";

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

  ownerPicture: SafeUrl = "";
  sharedPictures: SafeUrl[] = [];

  innerWidth: any;

  ismanaging: boolean = false;

  nextTask!: taskDTO | null;

  constructor(private userService: UserService, private planningService: PlanningService, private taskService: TaskService, private formBuilder: FormBuilder, private toastr: ToastrService, private dialog: MatDialog, private sanitizer: DomSanitizer) {
  }

  @HostListener('window.resize', ['$event'])
  onResize(event: any) {
    console.log('isManaging task ?');
    console.log(this.ismanaging);
    this.innerWidth = event.target.innerWidth;
    console.log(innerWidth < 769);

  }


  ngOnInit(): void {

    this.innerWidth = window.innerWidth;

    this.isManagingTask$.subscribe({
      next: (test) => {
        console.log('Is managing task ?');
        this.ismanaging = test;
      }
    })

    this.formAddShare = this.formBuilder.group({
      emailShare: new FormControl("", [Validators.required, Validators.email])
    });
    this.user$.subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log("Current User :")
        console.log(this.currentUser);
        if (this.currentUser?.photo == null || this.currentUser?.photo?.length == 0) {
          this.ownerPicture = '/assets/profilePicture/neutral_avatar.png';
        } else {
          this.getProfilePicture(this.currentUser?.photo!, -1);
        }
      },
    });
    this.usersShared$.subscribe({
      next: (data) => {
        console.log("Cool de nouveau partage !")
        this.currentSharedUsers = data;
        console.log(this.currentSharedUsers);
        this.isPlanningLoading = false;
        if (this.currentSharedUsers != undefined && this.currentSharedUsers!.length > 0) {
          for (let i = 0; i < Math.max(2, this.currentSharedUsers?.length!); i++) {
            if (this.currentSharedUsers![i].photo == null || this.currentSharedUsers![i].photo.length == 0) {
              this.sharedPictures.push('/assets/profilePicture/neutral_avatar.png');
            } else {
              this.getProfilePicture(this.currentSharedUsers![i].photo, i);
            }
          }
        }
      }
    });
    this.planning$.pipe(
      switchMap((planning, index) => {
        console.log("subscribing to new planning lol")
        this.currentPlanning = planning;
        this.currentPlanning?.taskList.forEach((task) => {
          if (new Date(task.dateTaskStart) > new Date() && (this.nextTask?.dateTaskStart! > task.dateTaskStart || this.nextTask == undefined)) {
            this.nextTask = task;
          }
        })

        // this.nextTask = this.currentPlanning?.taskList.find(task => new Date(task.dateTaskStart) > new Date())!;
        console.log(this.nextTask);
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

  getProfilePicture(filename: string, index: number) {
    if (!filename) {
      filename = this.currentUser?.photo!
    }
    console.log('LE FILENAME');
    console.log(filename);
    this.userService.getFile(filename).subscribe({
      next: (blobImg: Blob) => {
        console.log("Safe Url :")
        console.log(blobImg);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
        if (index < 0) {
          this.ownerPicture = safeUrl
        } else {
          this.sharedPictures.push(safeUrl);
        }
      }
    })
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
  }

  submitNewShare() {
    if (this.formAddShare.valid) {
      const newShareDto: setNewShareDTO = {
        email: this.formAddShare.value.emailShare,
        planningId: this.currentPlanning?.idPlanning!,
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
    const dialogRef = this.dialog.open(ShareManagerComponent, {
      data: {
        localSharedUsers: this.currentSharedUsers,
        localCurrentUser: this.currentUser,
        localIdPlanning: this.currentPlanning?.idPlanning!,
        localSharedPictures: this.sharedPictures
      },
      width: "500px",
      height: "500px",
      maxHeight: "500px",
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  removeCurrentUserFromShare() {
    const currentUserShareDto = this.currentSharedUsers?.find((sharedUserDto) => sharedUserDto.idUser = this.currentUser?.idUser!);
    if (currentUserShareDto) {
      const sharedto: shareDTO = {
        userId: currentUserShareDto.idUser,
        planningId: this.currentPlanning?.idPlanning!,
        isReadOnly: currentUserShareDto.readOnly,
      }
      this.planningService.deleteShare(sharedto).subscribe({
        next: () => {
          this.toastr.success("You removed yourself from the planning ID " + sharedto.planningId);
          this.currentUser!.sharedPlanningId = this.currentUser?.sharedPlanningId?.filter(idShare => idShare != this.currentPlanning?.idPlanning!);
          this.planningService.getOwnerPlanning().subscribe();
        }
      })
    }
  }

}

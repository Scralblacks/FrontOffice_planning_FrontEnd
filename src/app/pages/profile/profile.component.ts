import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {BehaviorSubject, Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UpdateUserDTO} from "../../models/updateUserDTO";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DeleteUserComponent} from "./delete-user/delete-user.component";
import {MatDialog} from "@angular/material/dialog";
import {PlanningService} from "../../services/planning/planning.service";
import {taskDTO} from "../../models/taskDTO";
import {planningDTO} from "../../models/planningDTO";
import {planningCardShared} from "../../models/planningCardShared";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  formUser!: FormGroup;
  isVisible: boolean = false;
  user$: Observable<userDTO | null> = this.userService.user;
  currentUser!: userDTO | null;
  currentFile?: File;
  imageURL!: SafeUrl;
  ownerPlanning = this.planningService.getOwnerPlanning()
  sharedPlannings$ = new BehaviorSubject<planningDTO[]>([])
  updateBtnStyle = {width: '50%', marginTop: '1em'}
  ownerNextTask$ = new BehaviorSubject<taskDTO | null>(null)
  cardPlanningSharedList$ = new BehaviorSubject<any>([])
  sharedPlanning!: Observable<planningDTO>;


  get ownerNextTask() {
    return this.ownerNextTask$.asObservable()
  }

  get cardPlanningSharedList() {
    return this.cardPlanningSharedList$.asObservable()
  }

  get sharedPlannings() {
    return this.sharedPlannings$.asObservable()
  }

  constructor(private formBuilder: FormBuilder, private userService: UserService, private sanitizer: DomSanitizer, private dialog: MatDialog,
              private planningService: PlanningService) {
  }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.min(6)]),
      city: new FormControl("", [Validators.required]),
      zipcode: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    })

    this.ownerPlanning.subscribe({
      next: planning => {
        this.ownerNextTask$.next(this.planningService.getFirstNextTask(planning))
      },
    })

    this.user$.subscribe({
      next: (data) => {
        this.currentUser = data;
        this.formUser.patchValue({
            username: this.currentUser?.username,
            city: this.currentUser?.addressDTO?.city,
            zipcode: this.currentUser?.addressDTO?.postalCode,
          }
        )
        if (this.currentUser?.photo) {
          this.userService.getFile(this.currentUser?.photo).subscribe({
            next: (blobImg: Blob) => {
              this.imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
            }
          })
        }
        if (data?.sharedPlanningId?.length != 0 && data?.sharedPlanningId && data.idUser) {
          for (let i = 0; i < data?.sharedPlanningId?.length; i++) {
            this.sharedPlanning = this.planningService.getSharedPlanning({
              userId: data.idUser,
              planningId: data.sharedPlanningId[i]
            })
            this.sharedPlanning.subscribe({
              next: (planning) => {
                this.sharedPlannings$.value.push(planning)
                this.sharedPlannings$.next(this.sharedPlannings$.value)
              }
            })
          }
        }
      },
    })

    this.sharedPlannings.subscribe({
      next: (plannings) => {
        let card: planningCardShared = {
          nextTask: this.ownerNextTask$.value,
          image: null
        }
        this.cardPlanningSharedList$.next([])
        if (plannings.length != 0) {
          for (let i = 0; i < plannings.length; i++) {
            if (plannings[i].usersDTO.photo == null) {
              card = {
                nextTask: this.planningService.getFirstNextTask(plannings[i]),
                image: null
              }
              this.cardPlanningSharedList$.value.push(card)
              this.cardPlanningSharedList$.next(this.cardPlanningSharedList$.value)
            } else {
              card = {
                nextTask: this.planningService.getFirstNextTask(plannings[i]),
                image: this.getProfilePicture(plannings[i].usersDTO.photo)
              }
              this.cardPlanningSharedList$.value.push(card)
              this.cardPlanningSharedList$.next(this.cardPlanningSharedList$.value)
            }
          }
        }
      }
    })


    this.cardPlanningSharedList.subscribe({
      next: data => {
        console.log("SHARED CARDS : ")
        console.log(data)
      }
    })
  }


  switchPasswordVisibility() {
    this.isVisible = !this.isVisible;
  }

  selectFile(event: any) {
    this.currentFile = event.target.files[0];
    this.upload();
  }

  upload(): void {
    if (this.currentFile) {
      this.userService.upload(this.currentFile).subscribe(
        (blobImg) => {
          this.imageURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
        },
        (err: any) => {
          console.log(err);
          this.currentFile = undefined;
        });


    }
  }

  submitUpdateProfile() {
    if (this.formUser.valid) {
      let updateUserDto: UpdateUserDTO = {
        idUser: this.currentUser?.idUser!,
        email: this.currentUser?.email!,
        username: this.formUser.value.username,
        city: this.formUser.value.city,
        postalCode: this.formUser.value.zipcode,
      }

      if (this.formUser.value.password) {
        updateUserDto.password = this.formUser.value.password;
      }

      this.userService.updateUser(updateUserDto).subscribe({
        next: () => {
          this.formUser.patchValue({
            password: null
          })
        }
      });
    }
  }

  openDeleteDiag() {

    this.dialog.open(DeleteUserComponent, {
      width: "500px",
      height: "200px",
      maxHeight: "200px",
    })
  }

  getProfilePicture(filename: string | undefined) {
    if (filename) {
      let safeUrl!: any
      if (!filename) {
        filename = this.currentUser?.photo!
      }
      this.userService.getFile(filename).subscribe({
        next: (blobImg: Blob) => {
          safeUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
        }
      })
      return safeUrl
    } else {
      return null
    }
  }

}

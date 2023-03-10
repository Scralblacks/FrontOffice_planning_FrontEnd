import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../services/user/user.service";
import {AuthService} from "../../../services/auth/auth.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {

  localCurrentUserId!: number;
  title: string = "Are you sure you want to delete your account ?"
  deleteAvailable$ = new BehaviorSubject<boolean>(false);

  get deleteAvailable() {
    return this.deleteAvailable$.asObservable()
  }

  constructor(public dialogRef: MatDialogRef<DeleteUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userService.user.subscribe({
      next: (userDTO) => {
        if (userDTO?.idUser) {
          this.localCurrentUserId = userDTO.idUser
          this.deleteAvailable$.next(true)
        }
      }
    })
  }

  cancelDelete() {
    this.dialogRef.close();
  }

  confirmDelete() {
    if (this.localCurrentUserId) {
      this.userService.deleteUserById(this.localCurrentUserId).subscribe({
        next: bool => {
          if (bool) {
            this.cancelDelete()
            this.authService.logout()
          }
        },
        error: err => {
          console.log(err)
        }
      })
    } else {
      console.log("PROBLEM : localCurrentUserId = " + this.localCurrentUserId)
    }
  }
}

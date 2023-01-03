import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {userDTO} from "../../models/userDTO";
import {PlanningService} from "../../services/planning/planning.service";
import {shareDTO} from "../../models/shareDTO";
import {sharedUsersDTO} from "../../models/sharedUsersDTO";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  localSharedUsers: sharedUsersDTO[] = [];

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
              @Inject(MAT_DIALOG_DATA) public usersShared: sharedUsersDTO[], private planningService: PlanningService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.localSharedUsers = this.usersShared;
    console.log(this.localSharedUsers);
  }

  // When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {
    alert("You have logged out.");
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }

  updateShare(sharedUsersDTO: sharedUsersDTO) {
    const shareDto: shareDTO = {
      userId: sharedUsersDTO.idUser,
      planningId: this.planningService.planningStorage.idPlanning,
      isReadOnly: !sharedUsersDTO.readOnly
    }
    this.planningService.updateShare(shareDto).subscribe({
      next: () => {
        let message = "User " + sharedUsersDTO.username + " is ";
        if(shareDto.isReadOnly) {
          message += " no more allowed to update your planning..."
        } else {
          message += " now allowed to update your planning..."
        }

        this.toastr.success(message);
      }
    })
  }

  deleteShare(sharedUsersDTO: sharedUsersDTO) {
    const shareDto: shareDTO = {
      userId: sharedUsersDTO.idUser,
      planningId: this.planningService.planningStorage.idPlanning,
      isReadOnly: sharedUsersDTO.readOnly
    }
    this.planningService.deleteShare(shareDto).subscribe({
      next: () => {
        this.toastr.success("User " + sharedUsersDTO.username + " can not access to your planning anymore...");
      }
    })
  }

}

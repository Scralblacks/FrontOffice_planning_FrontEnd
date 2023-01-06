import {Component, Inject, OnInit} from '@angular/core';
import {sharedUsersDTO} from "../../../models/sharedUsersDTO";
import {userDTO} from "../../../models/userDTO";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PlanningService} from "../../../services/planning/planning.service";
import {ToastrService} from "ngx-toastr";
import {shareDTO} from "../../../models/shareDTO";
import {SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-share-manager',
  templateUrl: './share-manager.component.html',
  styleUrls: ['./share-manager.component.css']
})
export class ShareManagerComponent implements OnInit {

  localSharedUsers: sharedUsersDTO[] = [];
  localCurrentUser!: userDTO | null;
  localIdPlanning!: number;
  localSharedPictures! : SafeUrl[];
  title: string = "Manage your share users";


  constructor(public dialogRef: MatDialogRef<ShareManagerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private planningService: PlanningService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.localSharedUsers = this.data.localSharedUsers;
    this.localCurrentUser = this.data.localCurrentUser;
    this.localIdPlanning = this.data.localIdPlanning;
    this.localSharedPictures = this.data.localSharedPictures
    if (this.localIdPlanning != this.localCurrentUser?.planningId!) this.title = "Look who you’re sharing this schedule with"
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
        if (shareDto.isReadOnly) {
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
        this.localSharedUsers = this.localSharedUsers.filter((sharedto) => sharedto.idUser != sharedUsersDTO.idUser);
      }
    })
  }

}

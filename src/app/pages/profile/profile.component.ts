import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UpdateUserDTO} from "../../models/updateUserDTO";

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


  constructor(private formBuilder: FormBuilder, private userService: UserService) {
  }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.min(6)]),
      city: new FormControl("", [Validators.required]),
      zipcode: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      photo: new FormControl("")
    })

    this.user$.subscribe({
      next: (data) => {
        this.currentUser = data;
        console.log('Profile')
        console.log(this.currentUser);
        this.formUser.patchValue({
            username: this.currentUser?.username,
            city: this.currentUser?.addressDTO?.city,
            zipcode: this.currentUser?.addressDTO?.postalCode,
            photo: this.currentUser?.photo
          }
        )

      },
    });

  }

  submitUpdateProfile() {
    if (this.formUser.valid) {
      let updateUserDto: UpdateUserDTO = {
        idUser: this.currentUser?.idUser!,
        photo: this.formUser.value.photo,
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

}

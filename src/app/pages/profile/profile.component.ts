import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {Observable} from "rxjs";
import {userDTO} from "../../models/userDTO";
import {UpdateUserDTO} from "../../models/updateUserDTO";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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
  imageURL!:SafeUrl;

  updateBtnStyle = {width: '50%', marginTop: '1em'}


  constructor(private formBuilder: FormBuilder, private userService: UserService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.min(6)]),
      city: new FormControl("", [Validators.required]),
      zipcode: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
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
          }
        )
        if (this.currentUser?.photo) {
          this.userService.getFile(this.currentUser?.photo).subscribe({
            next: (blobImg: Blob) => {
              this.imageURL =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
            }
          })
        }
      },
    });

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
            this.imageURL =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blobImg));
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

}

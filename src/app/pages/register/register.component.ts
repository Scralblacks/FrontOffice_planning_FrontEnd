import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SignupRequest} from "../../models/signupRequest";
import {AuthService} from "../../services/auth/auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formAddUser!: FormGroup;

  loggedIn$: Observable<boolean> = this.authService.isLoggedIn;

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('confirm')!.value
    return pass === confirmPass ? null : {notSame: true}
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.loggedIn$.subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigate(['/planning'])
        }
      }
    })

    this.formAddUser = this.formBuilder.group({
      userEmail: new FormControl("", [Validators.required, Validators.email]),
      userName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      confirm: new FormControl("", [Validators.required]),
      city: new FormControl(""),
      zipcode: new FormControl(""),
    }, {validators: this.checkPasswords});

  }

  onSubmit() {
    if (this.formAddUser.valid) {
      const signupRequest: SignupRequest = {
        email: this.formAddUser.value.userEmail,
        username: this.formAddUser.value.userName!,
        password: this.formAddUser.value.password!,
        city: this.formAddUser.value.city,
        postalCode: this.formAddUser.value.zipcode
      }

      console.log(signupRequest);

      this.authService.register(signupRequest).subscribe({
        next: () => {
          this.toastr.success("Successfully registered !");
          this.router.navigate(["/login"])
        },
        error: (err) => {
          console.log(err)
        }
      });
    } else {
      this.toastr.error("Something happened... Try again !");
    }
  }
}

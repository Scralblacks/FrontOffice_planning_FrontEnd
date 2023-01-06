import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SigninRequest} from "../../models/signinRequest";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }


  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      userEmail: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    })
  }

  signin() {
    const signinRequest: SigninRequest = {
      email: this.formLogin.value.userEmail,
      password: this.formLogin.value.password,
    }

    this.authService.login(signinRequest).subscribe({
      next: (connected: boolean) => {
        console.log("Connected : " + connected);
        if (connected) {
          this.toastr.success("Successfully logged in !");
          this.router.navigate(['/planning'])
        } else {
          this.toastr.error("Wrong credentials !")
        }
      },
      error: (err) => {
        console.log(err)
      }
    })

  }
}

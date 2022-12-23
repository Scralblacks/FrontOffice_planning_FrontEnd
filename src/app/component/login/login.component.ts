import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  login = new FormGroup({
    userEmail: new FormControl(""),
    password: new FormControl(""),
  })

  ngOnInit(): void {
  }

  signin() {
    const email = this.login.value.userEmail!;
    const password = this.login.value.password!;

    this.authService.login(email, password).subscribe({
      next : (connected: boolean) => {
        console.log("Connected : " + connected)
        this.router.navigate(['/planning/email/$'])
      },
      error : (err) => {
        console.log(err)
      }
    })

  }
}

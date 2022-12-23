import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {User} from "../models/user";
import {Address} from "../models/address";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  addUser = new FormGroup({
    userEmail: new FormControl(""),
    userName: new FormControl(""),
    password: new FormControl(""),
    confirm: new FormControl(""),
    city: new FormControl(""),
    zipcode: new FormControl(""),
  });

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.addUser.value.password == this.addUser.value.confirm) {

      const userAddress: Address = {
        city: this.addUser.value.zipcode!,
        zipcode: this.addUser.value.zipcode!
      }

      const newUser: User = {
        email: this.addUser.value.userEmail!,
        userName: this.addUser.value.userName!,
        password: this.addUser.value.password!,
        address: userAddress,
      }

      this.userService.save(newUser).subscribe({
        next: () => {
          this.router.navigate(["/login", newUser])
        },
        error: (err) => {
          console.log(err)
        },
        complete: () => {
          console.log('Complete')
        }
      })
    } else {
      alert("The password and its confirmation do not match")
    }
  }
}

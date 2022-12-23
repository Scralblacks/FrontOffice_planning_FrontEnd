import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {RegisterComponent} from "./component/register/register.component";
import {PlanningComponent} from "./component/planning/planning.component";
import {MeteoComponent} from "./component/meteo/meteo.component";

const routes: Routes = [
  {path: "", redirectTo: "meteo", pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "planning", component: PlanningComponent},
  {path: "meteo", component: MeteoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

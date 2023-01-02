import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {AuthGuardService} from "./helpers/auth-guard.service";
import {PlanningComponent} from "./pages/planning/planning.component";
import {ContentLayoutComponent} from "./layout/content-layout/content-layout.component";
import {ProfileComponent} from "./pages/profile/profile.component";

const routes: Routes = [
  {path: '', redirectTo: 'register', pathMatch: 'full'},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {
    path: '',
    component: ContentLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "planning",
        component: PlanningComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuardService],
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

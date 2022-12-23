import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from "./component/login/login.component";
import { RegisterComponent } from "./component/register/register.component";
import { TaskComponent } from "./component/task/task.component";
import { PlanningComponent } from "./component/planning/planning.component";
import { UserComponent } from "./component/user/user.component";
import { NavbarComponent } from "./component/navbar/navbar.component";
import { MeteoComponent } from './component/meteo/meteo.component';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TaskComponent,
    PlanningComponent,
    UserComponent,
    MeteoComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";

import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {InputComponent} from './shared/ui/input/input.component';
import {HttpClientModule} from "@angular/common/http";
import {SubmitButtonComponent} from './shared/ui/submit-button/submit-button.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthInterceptorProviders} from "./helpers/auth.interceptor";
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {HeaderComponent} from './layout/header/header.component';
import {PlanningComponent} from "./pages/planning/planning.component";
import { CalendarComponent } from './pages/planning/calendar/calendar.component';
import { DayBoxComponent } from './pages/planning/calendar/day-box/day-box.component';
import { TaskListComponent } from './pages/planning/task-list/task-list.component';
import { TaskComponent } from './pages/planning/task-list/task/task.component';
import { TaskManagerComponent } from './pages/planning/task-manager/task-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InputComponent,
    SubmitButtonComponent,
    ContentLayoutComponent,
    HeaderComponent,
    PlanningComponent,
    CalendarComponent,
    DayBoxComponent,
    TaskListComponent,
    TaskComponent,
    TaskManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      autoDismiss: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: "decreasing",
    })
  ],
  providers: [AuthInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}

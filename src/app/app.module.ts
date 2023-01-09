import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";

import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputComponent} from './shared/ui/input/input.component';
import {HttpClientModule} from "@angular/common/http";
import {SubmitButtonComponent} from './shared/ui/submit-button/submit-button.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthInterceptorProviders} from "./helpers/auth.interceptor";
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {HeaderComponent} from './layout/header/header.component';
import {PlanningComponent} from "./pages/planning/planning.component";
import {CalendarComponent} from './pages/planning/calendar/calendar.component';
import {DayBoxComponent} from './pages/planning/calendar/day-box/day-box.component';
import {TaskListComponent} from './pages/planning/task-list/task-list.component';
import {TaskComponent} from './pages/planning/task-list/task/task.component';
import {TaskManagerComponent} from './pages/planning/task-manager/task-manager.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {ModalComponent} from './layout/modal/modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {ShareManagerComponent} from './pages/planning/share-manager/share-manager.component';
import {MeteoComponent} from './pages/meteo/meteo.component';
import {DeleteUserComponent} from "./pages/profile/delete-user/delete-user/delete-user.component";

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
    TaskManagerComponent,
    ProfileComponent,
    ModalComponent,
    ShareManagerComponent,
    TaskManagerComponent,
    MeteoComponent,
    DeleteUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      autoDismiss: true,
      closeButton: true,
      progressBar: true,
      progressAnimation: "decreasing",
    }),
    MatButtonModule,
    FormsModule
  ],
  providers: [AuthInterceptorProviders],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent],
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoginComponent} from "./component/login/login.component";
import {RegisterComponent} from "./component/register/register.component";

import {AppRoutingModule} from './app-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputComponent} from './shared/ui/input/input.component';
import {HttpClientModule} from "@angular/common/http";
import {SubmitButtonComponent} from './shared/ui/submit-button/submit-button.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InputComponent,
    SubmitButtonComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

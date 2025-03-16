
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { HomepageComponent } from './homepage/homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmemailComponent } from './confirmemail/confirmemail.component';

import { ExercisesComponent } from './exercises/exercises.component';
import { ListbarComponent } from './listbar/listbar.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramComponent } from './program/program.component';
import { MyprogramsComponent } from './myprograms/myprograms.component';
import { AddprogramComponent } from './addprogram/addprogram.component';
import { MessagesComponent } from './messages/messages.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { MyactivitiesComponent } from './myactivities/myactivities.component';
import { ChartModule } from 'angular-highcharts';
import { UpdateProfileComponent } from './update-profile/update-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomepageComponent,
    ConfirmemailComponent,
    ExercisesComponent,
    ListbarComponent,
    ProgramsComponent,
    ProgramComponent,
    MyprogramsComponent,
    AddprogramComponent,
    MessagesComponent,
    SendMessageComponent,
    MyactivitiesComponent,
    UpdateProfileComponent
    
  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule
  

  ],
  providers: [
    provideClientHydration(),
    AuthService,
    provideHttpClient(withFetch())
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

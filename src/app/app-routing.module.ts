import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ConfirmemailComponent } from './confirmemail/confirmemail.component';
import { ListbarComponent } from './listbar/listbar.component';
import { ExercisesComponent } from './exercises/exercises.component';
import { ProgramsComponent } from './programs/programs.component';
import { ProgramComponent } from './program/program.component';
import { MyprogramsComponent } from './myprograms/myprograms.component';
import { AddprogramComponent } from './addprogram/addprogram.component';
import { MessagesComponent } from './messages/messages.component';
import { MyactivitiesComponent } from './myactivities/myactivities.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';


const routes: Routes = [
  { 
    path:'app-login', 
    component: LoginComponent
  },
  {
    path:'app-register',
    component: RegisterComponent
  },
  {
    path:'app-confirmemail',
    component: ConfirmemailComponent
  },
  {
    path: '',
    component: ListbarComponent,
    children: [
      {
        path: '',
        redirectTo: 'app-homepage',
        pathMatch: 'full'
      },
      {
        path: 'app-homepage',
        component: HomepageComponent
      },
      {
        path: 'app-exercises',
        component: ExercisesComponent
      },
      {
        path: 'app-programs',
        component: ProgramsComponent,    
      },
      {
        path: 'app-program/:id',
        component: ProgramComponent
      },
      {
        path: 'app-myprograms',
        component: MyprogramsComponent
      },
      {
        path: 'app-addprogram',
        component: AddprogramComponent

      },
      {
        path: 'app-messages',
        component: MessagesComponent
      },
      {
        path: 'app-myactivities',
        component: MyactivitiesComponent
      },
      {
        path: 'app-update-profile',
        component: UpdateProfileComponent
      }
    ]
  }
   

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

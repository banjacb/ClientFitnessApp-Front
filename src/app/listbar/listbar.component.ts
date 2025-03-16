import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listbar',
  templateUrl: './listbar.component.html',
  styleUrl: './listbar.component.css'
})
export class ListbarComponent {

  isLoggin= false;

  constructor(private router : Router, private authService: AuthService)
  {
    if(authService.isLoggin())
      {
        this.isLoggin= true;
      }
  }

  logOut()
  {
    if (this.isLoggin) {
      this.authService.logoutUser();
        
      }
    }
  

}

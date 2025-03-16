import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-confirmemail',
  templateUrl: './confirmemail.component.html',
  styleUrl: './confirmemail.component.css'
})
export class ConfirmemailComponent implements OnInit{

  emailConfirmed: boolean =false;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  )
  {}

  ngOnInit() {

    console.log('da li ulazi ovdje');
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.confirmEmail();
      }
    });
    
  }
  
  confirmEmail()
  {
    this.authService.verifyToken(this.token).subscribe( response => {
      if(response)   
        {
        this.router.navigate(['/app-login']); 
        }
        else
        {

          console.log('Error confirming email: ovo je greska respone=false');
        }
      }, 
      error => {
        console.log('Error confirming email:', error);
      }
    );
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { dateFormat } from 'highcharts';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  public errorMessage: string | null = null;
   loginForm: FormGroup;
  public username = new FormControl(null, [Validators.required]) as FormControl & { value: string };
  public password = new FormControl(null, [Validators.required]) as FormControl & { value: string };
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) { 
    this.loginForm = this.fb.group({
      password: this.password,
      username: this.username
    });
   
  }

  public onSubmit() {
    const urlStatistic='http://localhost:9000/statistics';
    if (this.loginForm.valid) {
      const username = this.username.value;
      const password = this.password.value;

      this.authService.login(username, password).subscribe(response => {
        if (response) {
          this.authService.storeUser(response);
          this.authService.verifyToken(response.token);
          this.errorMessage = 'Uspjesna prijava.';
      
          this.router.navigate(['/app-homepage']); 
        } else {
          this.errorMessage = 'Korisničko ime ili lozinka nisu ispravni.';
        }
      }, error => {
        this.errorMessage = 'Greška prilikom prijavljivanja.'
        
      });
    } else {

   
      
      this.errorMessage='Korisnik nije unio sve podatke.'
     
      
    }

    if(this.errorMessage)
      {

    console.log(this.errorMessage);
        
        const formData = {
          description: this.errorMessage,
          date: new Date()
        };

        this.http.post(urlStatistic, formData).subscribe((response) => {
          console.log('Program- statistika je uspešno dodat.', response);
          
        }, (error) => {
          console.error('Došlo je do greške prilikom dodavanja statistike.', error);
          
        });
      
    
      }

    
   

    }
  }


  

  
